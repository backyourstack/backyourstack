require('dotenv').config();
const debug = require('debug')('server');
const path = require('path');
const express = require('express');
const expressSession = require('express-session');
const next = require('next');
const { get } = require('lodash');

const routes = require('../routes');
const passport = require('./passport');
const { fetchWithBasicAuthentication } = require('./utils');

const multer = require('multer');
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

const port = parseInt(process.env.PORT, 10) || 3000;

const nextApp = next({
  dir: path.dirname(__dirname),
  dev: process.env.NODE_ENV !== 'production',
});

const handler = routes.getRequestHandler(nextApp);

nextApp.prepare()
  .then(() => {
    const server = express();

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
            if (err) throw err;
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


    server.post('/files', upload.single('file'), function (req, res, next) {

        if (req.file.mimetype == 'application/json')
        {
            // const put = knox.put(filename, {
            //   'Content-Length': req.file.size,
            //   'Content-Type': req.file.mimetype,
            //   'x-amz-acl': 'public-read'
            // });
            //
            // fs.createReadStream(req.path).pipe(put);
            //
            // put.on('response', (response) => {
            //   res.send({
            //     status: response.statusCode,
            //     url: put.url
            //   });
            // });

            res.send("Uploaded");
          }

          else {res.send("Unsupported");}


      });

    server.get('*', handler);


    server.listen(port, err => {
      if (err) throw err;
      debug(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(err => {
    debug(`> Error while starting server: ${err.message}`);
  });
