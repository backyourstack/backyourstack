import passport from 'passport';
import passportGithub from 'passport-github';
import debug from 'debug';

import { donateToken } from '../lib/github';

const _debug = debug('auth');

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_TOKEN_DONATORS } = process.env;

const githubTokenDonators = (GITHUB_TOKEN_DONATORS || '').split(',').map(str => str.trim());

const githubParams = {
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
};

const passportGithubStrategy = new passportGithub.Strategy(
  githubParams,
  (accessToken, refreshToken, profile, cb) => {
    _debug(accessToken, refreshToken, profile);
    const { id, username, displayName, _json: { avatar_url: avatarUrl } } = profile;
    if (githubTokenDonators.indexOf(username) !== -1) {
      donateToken(accessToken);
    }
    cb(null, { id, username, displayName, avatarUrl, accessToken, refreshToken });
  }
);

passport.use(passportGithubStrategy);

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export default passport;
