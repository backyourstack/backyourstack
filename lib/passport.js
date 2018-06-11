const passport = require('passport');
const passportGithub = require('passport-github');
const debug = require('debug')('auth');

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;

const githubParams = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: GITHUB_CALLBACK_URL
};

const passportGithubStrategy = new passportGithub.Strategy(
  githubParams,
  (accessToken, refreshToken, profile, cb) => {
    debug(accessToken, refreshToken, profile);
    const { id, username, displayName } = profile;
    cb(null, { id, username, displayName, accessToken, refreshToken });
  }
);

passport.use(passportGithubStrategy);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
