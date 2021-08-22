import passport from 'passport';
import passportGithub from 'passport-github';

import logger from './logger';

import { donateToken } from './github';

const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_TOKEN_DONATORS } =
  process.env;

const githubTokenDonators = (GITHUB_TOKEN_DONATORS || '')
  .split(',')
  .map((str) => str.trim());

if (GITHUB_CLIENT_ID && GITHUB_CLIENT_SECRET) {
  const passportGithubStrategy = new passportGithub.Strategy(
    { clientID: GITHUB_CLIENT_ID, clientSecret: GITHUB_CLIENT_SECRET },
    (accessToken, refreshToken, profile, cb) => {
      const {
        id,
        username,
        displayName,
        _json: { avatar_url: avatarUrl },
      } = profile;
      if (githubTokenDonators.indexOf(username) !== -1) {
        donateToken(accessToken);
      }
      cb(null, {
        id,
        username,
        displayName,
        avatarUrl,
        accessToken,
        refreshToken,
      });
    },
  );

  passport.use(passportGithubStrategy);
} else {
  logger.info(
    'No GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET, set these environment keys to allow authentication with GitHub.',
  );
}

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

export default passport;
