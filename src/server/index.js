import '../env';

import path from 'path';
import crypto from 'crypto';

import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import multer from 'multer';
import next from 'next';
import md5 from 'md5';
import { get, has, pick } from 'lodash';

import routes from '../routes';
import logger from '../logger';

import passport from './passport';
import { fetchWithBasicAuthentication } from './utils';
import { dispatchOrder } from '../lib/opencollective';
import {
  detectDependencyFileType,
  detectProjectName,
} from '../lib/dependencies/utils';
import {
  getProfile,
  getUserOrgs,
  searchUsers,
  getProfileData,
  getFilesData,
  emailSubscribe,
} from '../lib/data';
import { fetchDependenciesFileContent } from '../lib/dependencies/data';
import { uploadFiles, getFiles, saveProfile } from '../lib/s3';

const {
  PORT,
  SESSION_SECRET,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
} = process.env;

const sessionSecret = SESSION_SECRET || crypto.randomBytes(64).toString('hex');

const port = parseInt(PORT, 10) || 3000;

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
});

const cookieOptions = {
  path: '/',
  httpOnly: true,
  secure: false,
};

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare().then(() => {
  const server = express();
  const upload = multer();

  server.use(
    favicon(path.join(path.dirname(__dirname), 'static', 'favicon.ico')),
  );

  server.use(cookieParser());

  server.use(
    expressSession({
      name: 'sessionId',
      secret: sessionSecret,
      resave: false,
      saveUninitialized: false,
      cookie: cookieOptions,
    }),
  );

  server.use(passport.initialize());
  server.use(passport.session());

  server.use(express.json());

  server.get('/logout', (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    fetchWithBasicAuthentication(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)(
      `https://api.github.com/applications/${GITHUB_CLIENT_ID}/grants/${accessToken}`,
      { method: 'DELETE' },
    ).then(() => {
      req.session.destroy(err => {
        if (err) {
          throw err;
        }
        const next = req.query.next || '/';
        res.clearCookie('sessionId', cookieOptions).redirect(next);
      });
    });
  });

  server.get('/auth/github', (req, res, next) => {
    if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
      throw new Error(
        'No GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, set these environment keys to allow authentication with GitHub.',
      );
    }
    req.session.next = req.query.next || '/';
    passport.authenticate('github', { scope: 'repo' })(req, res, next);
  });

  server.get(
    '/auth/github/callback',
    passport.authenticate('github', { failureRedirect: '/login' }),
    (req, res) => {
      const next = req.session.next || '/';
      delete req.session.next;
      res.cookie('_now_no_cache', '1', cookieOptions);
      res.redirect(next);
    },
  );

  server.get('/data/getProfile', (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    if (!accessToken) {
      res.setHeader('Cache-Control', 's-maxage=3600, max-age=0');
    }
    getProfile(req.query.slug, accessToken).then(data => res.json(data));
  });

  server.get('/data/getUserOrgs', (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    getUserOrgs(accessToken).then(data => res.json(data));
  });

  server.get('/data/searchUsers', (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    searchUsers(req.query.q, accessToken).then(data => res.json(data));
  });

  server.get('/data/getProfileData', (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    if (!accessToken) {
      res.setHeader('Cache-Control', 's-maxage=3600, max-age=0');
    }
    getProfileData(req.query.id, accessToken).then(data => res.json(data));
  });

  server.get('/data/getFilesData', (req, res) => {
    const files = get(req, 'session.files');
    getFilesData(files).then(data => res.json(data));
  });

  server.post('/data/emailSubscribe', (req, res) => {
    const email = get(req, 'body.email');
    const profile = get(req, 'body.profile');
    emailSubscribe(email, profile).then(data => res.json(data));
  });

  server.post('/files/upload', upload.array('files'), (req, res) => {
    let uploadAccepted = false;
    req.session.files = req.session.files || {};
    req.files.forEach(raw => {
      const file = {
        mime: raw.mimetype,
        name: raw.originalname,
        text: raw.buffer.toString('utf8'),
      };
      if (detectDependencyFileType(file)) {
        file.projectName = detectProjectName(file);
        const id = file.projectName || md5(file.text);
        req.session.files[id] = file;
        uploadAccepted = true;
      }
    });
    if (uploadAccepted) {
      res.cookie('_now_no_cache', '1', cookieOptions);
      res.status(200).send('Ok. At least one file accepted.');
    } else {
      res.status(400).send('Bad Request. No file accepted.');
    }
  });

  server.post('/files/delete', (req, res) => {
    const id = get(req, 'body.id');
    const sessionFiles = get(req, 'session.files');
    if (id && sessionFiles) {
      delete sessionFiles[id];
    }
    res.send('Ok');
  });

  server.post('/files/save', async (req, res) => {
    const ids = get(req, 'body.ids');
    const sessionFiles = get(req, 'session.files');
    const files = {};
    ids.forEach(id => {
      files[id] = sessionFiles[id];
    });
    try {
      const savedData = await uploadFiles(files);
      return res.status(200).send(savedData);
    } catch (err) {
      console.error(err);
      return res.status(400).send('Unable to save file');
    }
  });

  server.post('/profile/save', async (req, res) => {
    const id = get(req, 'body.id');
    const accessToken = get(req, 'session.passport.user.accessToken');
    const { repos, profile } = await getProfileData(id, accessToken);
    for (const repo of repos) {
      let files = await fetchDependenciesFileContent(repo, accessToken);
      if (files.length) {
        files = files.map(({ matchedPattern, text }) => {
          const file = { name: matchedPattern, text };
          file.projectName = detectProjectName(file);
          file.id = file.projectName;
          return file;
        });
        repo.files = files;
      } else {
        continue;
      }
    }
    const savedData = await saveProfile(profile.login, repos);
    return res.status(200).send(savedData);
  });

  server.get('/:id/backing.json', async (req, res) => {
    const accessToken = get(req, 'session.passport.user.accessToken');
    const profileData = await getProfileData(req.params.id, accessToken);

    const { recommendations, opencollectiveAccount } = profileData;

    const backing = recommendations
      .filter(r => r.opencollective)
      .filter(r => r.opencollective.pledge !== true)
      .map(recommendation => {
        const { opencollective, github } = recommendation;
        const order =
          opencollectiveAccount &&
          get(opencollectiveAccount, 'orders.nodes', []).find(
            order =>
              opencollective && opencollective.slug === order.toAccount.slug,
          );
        if (order) {
          opencollective.order = order;
        }
        return {
          weight: 100,
          opencollective: pick(opencollective, ['id', 'name', 'slug', 'order']),
          github: github,
        };
      });

    res.send(backing);
  });

  server.get('/:uuid/file/backing.json', async (req, res) => {
    if (!req.params.uuid) {
      return res.status(400).send('Please provide the file key');
    }
    let data;

    try {
      data = await getFiles(req.params.uuid);
    } catch (err) {
      console.error(err);
      return res.status(400).send('Unable to fetch file');
    }

    if (!data) {
      return res.status(404).send('No file found');
    }

    const { recommendations, opencollectiveAccount } = await getFilesData(data);
    const backing = recommendations
      .filter(r => r.opencollective)
      .filter(r => r.opencollective.pledge !== true)
      .map(recommendation => {
        const { opencollective, github } = recommendation;
        const order =
          opencollectiveAccount &&
          get(opencollectiveAccount, 'orders.nodes', []).find(
            order =>
              opencollective && opencollective.slug === order.toAccount.slug,
          );
        if (order) {
          opencollective.order = order;
        }
        return {
          weight: 100,
          opencollective: pick(opencollective, ['id', 'name', 'slug', 'order']),
          github: github,
        };
      });
    return res.status(200).send(backing);
  });

  server.post('/order/dispatch', async (req, res) => {
    const orderId = get(req, 'body.orderId');
    try {
      const dispatchedOrders = await dispatchOrder(orderId);
      return res.status(200).send(dispatchedOrders);
    } catch (err) {
      console.error(err);
      return res.status(400).send({ error: err.message });
    }
  });

  server.use('/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    next();
  });

  server.use('/_next/static', (req, res, next) => {
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    next();
  });

  server.use((req, res, next) => {
    const sessionSet =
      has(req, 'session.passport') || has(req, 'session.files');
    const noCacheSet = has(req, 'cookies._now_no_cache');
    if (sessionSet && !noCacheSet) {
      res.cookie('_now_no_cache', '1', cookieOptions);
    } else if (!sessionSet && noCacheSet) {
      res.clearCookie('_now_no_cache', cookieOptions);
    }
    next();
  });

  server.get('*', handler);

  server.listen(port, err => {
    if (err) {
      throw err;
    }
    logger.info(`> Ready on http://localhost:${port}`);
  });
});
