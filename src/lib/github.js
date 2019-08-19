import fetch from 'cross-fetch';
import octokitRest from '@octokit/rest';
import minimatch from 'minimatch';
import { GraphQLClient } from 'graphql-request';
import { get, pick } from 'lodash';

import logger from '../logger';

import cache from './cache';

const baseRawUrl = 'https://raw.githubusercontent.com';

const baseGraphqlUrl = 'https://api.github.com/graphql';

function getSharedAccessToken() {
  const donatedTokens = cache.get('donatedTokens') || [];
  if (donatedTokens.length > 0) {
    return donatedTokens[Math.floor(Math.random() * donatedTokens.length)];
  } else {
    return process.env.GITHUB_GUEST_TOKEN;
  }
}

function getOctokit(accessToken) {
  const octokitParams = {};

  if (!accessToken) {
    accessToken = getSharedAccessToken();
  }
  if (accessToken) {
    octokitParams.auth = `token ${accessToken}`;
  }

  return octokitRest(octokitParams);
}

function getData(res) {
  logger.debug(`RateLimit Remaining: ${res.headers['x-ratelimit-remaining']}`);
  return res.data;
}

function getContent(data) {
  return Buffer.from(data.content, 'base64').toString('utf8');
}

function fetchWithOctokit(path, params, accessToken) {
  logger.verbose('Fetch with octokit', {
    path,
    params,
    withAccessToken: !!accessToken,
  });
  const octokit = getOctokit(accessToken);
  const func = get(octokit, path);
  return func(params).then(getData);
}

function fetchWithGraphql(query, params, accessToken) {
  if (!accessToken) {
    accessToken = getSharedAccessToken();
  }
  const client = new GraphQLClient(baseGraphqlUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return client.request(query, params);
}

function silentError(err) {
  logger.debug('Silently catched error', err);
}

function compactRepo(repo) {
  repo = pick(repo, [
    'id',
    'name',
    'owner',
    'full_name',
    'default_branch',
    'private',
    'language',
  ]);
  repo.owner = pick(repo.owner, ['login']);
  return repo;
}

async function fetchProfile(login, accessToken) {
  logger.verbose('Fetch profile', {
    login: login,
    withAccessToken: !!accessToken,
  });

  const cacheKey = `profile_${login}`;

  const profile = cache.get(cacheKey);
  if (profile) {
    return profile;
  }

  // https://octokit.github.io/rest.js/#api-Users-getByUsername
  const user = await fetchWithOctokit(
    'users.getByUsername',
    { username: login },
    accessToken,
  ).catch(silentError);
  if (user && user.type !== 'Organization') {
    cache.set(cacheKey, user);
    return user;
  }

  // https://octokit.github.io/rest.js/#api-Orgs-get
  const org = await fetchWithOctokit(
    'orgs.get',
    { org: login },
    accessToken,
  ).catch(silentError);
  if (org) {
    cache.set(cacheKey, org);
    return org;
  }

  return null;
}

async function fetchReposForProfile(profile, accessToken) {
  logger.verbose('Fetch repos for profile', {
    login: profile.login,
    withAccessToken: !!accessToken,
  });

  let repos = [];

  const publicCacheKey = `profile_repos_${profile.login}`;
  const privateCacheKey = `profile_repos_${profile.login}_${accessToken}`;

  if (accessToken && cache.has(privateCacheKey)) {
    return cache.get(privateCacheKey);
  } else if (!accessToken && cache.has(publicCacheKey)) {
    return cache.get(publicCacheKey);
  }

  let getReposPath, getReposParameters;
  if (profile.type == 'Organization') {
    // https://octokit.github.io/rest.js/#api-Repos-listForOrg
    getReposPath = 'repos.listForOrg';
    getReposParameters = { org: profile.login };
  } else {
    // https://octokit.github.io/rest.js/#api-Repos-listForUser
    getReposPath = 'repos.listForUser';
    getReposParameters = { username: profile.login };
  }

  // Pagination over all results
  getReposParameters.page = 1;
  getReposParameters.per_page = 100;
  while (true) {
    const fetchRepos = await fetchWithOctokit(
      getReposPath,
      getReposParameters,
      accessToken,
    );
    repos = [...repos, ...fetchRepos];
    if (fetchRepos.length < getReposParameters.per_page) {
      break;
    }
    getReposParameters.page++;
  }

  // Filter forks
  repos = repos.filter(repo => repo.fork === false);

  // Filter the keys we're interested in
  repos = repos.map(compactRepo);

  // Save in Private Cache
  cache.set(privateCacheKey, repos);

  const publicRepos = repos.filter(repo => repo.private === false);

  // Save in Public Cache
  cache.set(publicCacheKey, publicRepos);

  return accessToken ? repos : publicRepos;
}

function searchFilesFromRepo(repo, searchPattern, accessToken) {
  logger.verbose('Search files from repo', {
    owner: repo.owner.login,
    name: repo.name,
    searchPattern,
    withAccessToken: !!accessToken,
  });

  const params = {
    q: `filename:${searchPattern}+repo:${repo.full_name}`,
  };
  return fetchWithOctokit('search.code', params, accessToken)
    .then(result => result.items)
    .then(
      // Github returns partial matches (e.g. 'package.json.old'),
      // so double check hits are actual matches
      items => items.filter(file => minimatch(file.name, searchPattern)),
    )
    .then(items =>
      Promise.all(
        items.map(item => fetchFileFromRepo(repo, item.path, accessToken)),
      ),
    );
}

function fetchFileFromRepo(repo, path, accessToken) {
  const branch = repo.default_branch || repo.defaultBranch;
  logger.verbose('Fetch file from repo', {
    owner: repo.owner.login,
    name: repo.name,
    branch: branch,
    path,
    withAccessToken: !!accessToken,
  });

  if (repo.private === true) {
    const params = { owner: repo.owner.login, repo: repo.name, path: path };
    // https://octokit.github.io/rest.js/#api-Repos-getContent
    const content = fetchWithOctokit(
      'repos.getContents',
      params,
      accessToken,
    ).then(getContent);
    return { content, fileUrl: null };
  }

  const relativeUrl = `/${repo.owner.login}/${repo.name}/${branch}/${path}`;
  logger.verbose(`Fetching file from public repo ${relativeUrl}`);
  return fetch(`${baseRawUrl}${relativeUrl}`).then(async response => {
    if (response.status === 200) {
      const content = await response.text();
      const fileUrl = `${baseRawUrl}${relativeUrl}`;
      return { content, fileUrl };
    }
    throw new Error(`Can't fetch ${path} from ${relativeUrl}.`);
  });
}

function donateToken(accessToken) {
  const donatedTokens = cache.get('donatedTokens') || [];
  if (donatedTokens.indexOf(accessToken) === -1) {
    donatedTokens.push(accessToken);
    cache.set('donatedTokens', donatedTokens);
  }
}

export {
  fetchWithOctokit,
  fetchWithGraphql,
  fetchFileFromRepo,
  getContent,
  fetchProfile,
  fetchReposForProfile,
  donateToken,
  searchFilesFromRepo,
  silentError,
};
