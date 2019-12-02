import '../env';

import path from 'path';
import crypto from 'crypto';

import fs from 'fs-extra';
import express from 'express';
import expressSession from 'express-session';
import cookieParser from 'cookie-parser';
import favicon from 'serve-favicon';
import multer from 'multer';
import next from 'next';
import md5 from 'md5';
import { get, has } from 'lodash';

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
  getSavedSelectedDependencies,
  getSavedFilesData,
  emailSubscribe,
} from '../lib/data';
import { fetchDependenciesFileContent } from '../lib/dependencies/data';
import { getDependenciesAvailableForBacking } from '../lib/utils';
import {
  uploadFiles,
  saveProfile,
  saveProfileOrder,
  saveSelectedDependencies,
} from '../lib/s3';

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
    fetchWithBasicAuthentication(
      GITHUB_CLIENT_ID,
      GITHUB_CLIENT_SECRET,
    )(
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
    const loggedInUsername = get(req, 'session.passport.user.username');
    const profileOptions = { loggedInUsername };

    if (!accessToken) {
      res.setHeader('Cache-Control', 's-maxage=3600, max-age=0');
    }

    if (req.query.excludedRepos) {
      profileOptions.excludedRepos = JSON.parse(req.query.excludedRepos);
    }

    getProfileData(req.query.id, accessToken, profileOptions).then(data =>
      res.json(data),
    );
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
    const excludedRepos = get(req, 'body.excludedRepos', []);
    const accessToken = get(req, 'session.passport.user.accessToken');
    const loggedInUsername = get(req, 'session.passport.user.username');

    const data = await getProfileData(id, accessToken, {
      loggedInUsername,
      excludedRepos,
    });

    const repositories = data.repos.filter(
      repo => excludedRepos.indexOf(repo.name) === -1,
    );
    for (const repository of repositories) {
      let files = await fetchDependenciesFileContent(repository, accessToken);
      if (files.length) {
        files = files.map(({ matchedPattern, text }) => {
          const file = { name: matchedPattern, text };
          file.projectName = detectProjectName(file);
          file.id = file.projectName;
          return file;
        });
        repository.files = files;
      } else {
        continue;
      }
    }
    const savedId = await saveProfile(
      data.profile.login,
      repositories,
      excludedRepos,
    );
    return res.status(200).send({ id: savedId });
  });

  server.post('/selectedDependencies/save', async (req, res) => {
    const id = get(req, 'body.id');
    const selectedDependencies = get(req, 'body.selectedDependencies');
    const savedObjectInfo = await saveSelectedDependencies(
      id,
      selectedDependencies,
    );
    return res.status(200).send(savedObjectInfo);
  });

  server.get('/:id/backing.json', async (req, res) => {
    if (!req.params.id) {
      return res.status(400).send('Please provide the file key');
    }
    const id = req.params.id;

    try {
      const selectedDependencies = await getSavedSelectedDependencies(id);
      // Return selected dependencies directly if available
      if (selectedDependencies) {
        return res.status(200).send(selectedDependencies);
      }

      const { recommendations } = await getSavedFilesData(id);
      const backing = getDependenciesAvailableForBacking(recommendations);
      return res.status(200).send(backing);
    } catch (err) {
      console.error(err);
      return res.status(400).send('Unable to fetch file');
    }
  });

  server.get('/:id/badge', async (req, res) => {
    const data = await getSavedFilesData(req.params.id);
    if (!data) {
      return res.status(400).send('Unable to fetch profile.');
    }
    const { recommendations, order } = data;
    const backing = getDependenciesAvailableForBacking(recommendations);

    if (!order || order.status !== 'ACTIVE') {
      return res
        .status(400)
        .send(
          'Unable to fetch BackYourStack suscription on Open Collective, not found or not active.',
        );
    }

    const badge = await fs.readFile(
      path.join(__dirname, '..', 'badges', 'badge.svg'),
      'utf8',
    );
    res.setHeader('Content-Type', 'image/svg+xml;charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res
      .status(200)
      .send(badge.replace('{COUNT}', (backing && backing.length) || 0));
  });

  server.post('/order/dispatch', async (req, res) => {
    const loggedInUsername = get(req, 'session.passport.user.username');
    const orderId = get(req, 'body.orderId');
    const id = get(req, 'body.id');
    const order = { id: orderId };

    if (loggedInUsername) {
      order.triggeredBy = loggedInUsername;
    }

    try {
      const dispatchedOrders = await dispatchOrder(orderId);
      await saveProfileOrder(id, order);
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
