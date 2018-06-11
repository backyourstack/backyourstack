require('dotenv').config();
const debug = require('debug')('server');

const path = require('path');

const express = require('express')
const expressSession = require('express-session');
const next = require('next')
const routes = require('../routes');

const passport = require('./passport')

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const dir = path.dirname(__dirname);

const app = next({ dev, dir })
const handler = routes.getRequestHandler(app);

app.prepare()
  .then(() => {
    const server = express()

    server.use(expressSession({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

    server.use(passport.initialize());
    server.use(passport.session());

    server.get('/logout',
      (req, res) => {
        req.session.destroy((err) => {
          if (err) throw err;
          const next = req.query.next || '/';
          res.redirect(next);
        })
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

    server.get('/', (req, res, pass) => {
      debug(req.session);
      pass();
    });

    server.get('*', handler);

    server.listen(port, err => {
      if (err) throw err
      debug(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => {
    debug(`> Error while starting server: ${err.message}`)
  });
