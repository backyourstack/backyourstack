require('dotenv').config();

const debug = require('debug')('server');
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const multer = require('multer');
const next = require('next');
const { get } = require('lodash');

const md5 = require('md5');

const routes = require('../routes');
const passport = require('./passport');
const { fetchWithBasicAuthentication } = require('./utils');

const { getProfile, getUserOrgs, searchUsers, getProfileData, getFilesData } = require('../lib/data');

const port = parseInt(process.env.PORT, 10) || 3000;

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
});

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare()
  .then(() => {

    const server = express();
    const upload = multer();

    server.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

    server.use(passport.initialize());
    server.use(passport.session());

    server.get('/logout',
      (req, res) => {
        const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = process.env;
        const accessToken = get(req, 'session.passport.user.accessToken');
        fetchWithBasicAuthentication(GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET)(
          `https://api.github.com/applications/${GITHUB_CLIENT_ID}/grants/${accessToken}`,
          { method: 'DELETE' }
        ).then(() => {
          req.session.destroy((err) => {
            if (err) {
              throw err;
            }
            const next = req.query.next || '/';
            res.redirect(next);
          });
        });
      });

    server.get('/auth/github', (req, res, next) => {
      req.session.next = req.query.next || '/';
      passport.authenticate('github', { scope: 'repo' })(req, res, next);
    });

    server.get('/auth/github/callback',
      passport.authenticate('github', { failureRedirect: '/login' }),
      (req, res) => {
        const next = req.session.next || '/';
        delete req.session.next;
        res.redirect(next);
      }
    );

    server.get('/data/getProfile', (req, res) => {
      const accessToken = get(req, 'session.passport.user.accessToken');
      getProfile(req.query.slug, accessToken).then(data => res.send(data));
    });

    server.get('/data/getUserOrgs', (req, res) => {
      const accessToken = get(req, 'session.passport.user.accessToken');
      getUserOrgs(accessToken).then(data => res.send(data));
    });

    server.get('/data/searchUsers', (req, res) => {
      const accessToken = get(req, 'session.passport.user.accessToken');
      searchUsers(req.query.q, accessToken).then(data => res.send(data));
    });

    server.get('/data/getProfileData', (req, res) => {
      const accessToken = get(req, 'session.passport.user.accessToken');
      getProfileData(req.query.id, accessToken).then(data => res.send(data));
    });

    server.get('/data/getFilesData', (req, res) => {
      const files = get(req, 'session.files');
      getFilesData(files).then(data => res.send(data));
    });

    server.post('/files/upload', upload.array('files'), (req, res) => {
      req.session.files = req.session.files || {};
      req.files.forEach(raw => {
        const parsed = JSON.parse(raw.buffer.toString('utf8'));
        if (parsed) {
          if (parsed.dependencies || parsed.devDependencies || parsed.peerDependencies) {
            const id = parsed.name || md5(JSON.stringify(parsed));
            req.session.files[id] = { raw, parsed };
          }
        }
      });
      res.send('Ok');
    });

    server.get('*', handler);

    server.listen(port, err => {
      if (err) {
        throw err;
      }
      debug(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    debug(`> Error while starting server: ${err.message}`);
  });
