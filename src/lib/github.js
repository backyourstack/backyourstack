import debug from 'debug';
import fetch from 'cross-fetch';
import octokitRest from '@octokit/rest';
import { get, pick } from 'lodash';

import cache from './cache';

const _debug = debug('github');

const baseRawUrl = 'https://raw.githubusercontent.com';
const apiRawUrl = 'https://api.github.com';

function getOctokit (accessToken) {
  const octokit = octokitRest();
  if (!accessToken) {
    const donatedTokens = cache.get('donatedTokens') || [];
    if (donatedTokens.length > 0) {
      accessToken = donatedTokens[Math.floor(Math.random() * donatedTokens.length)];
    }
  }
  if (!accessToken) {
    accessToken = process.env.GITHUB_GUEST_TOKEN;
  }
  if (accessToken) {
    octokit.authenticate({ type: 'oauth', token: accessToken });
  }
  return octokit;
}

function getData (res) {
  _debug(`RateLimit Remaining: ${res.headers['x-ratelimit-remaining']}`);
  return res.data;
}

function getContent (data) {
  return Buffer.from(data.content, 'base64').toString('utf8');
}

function fetchWithOctokit (path, params, accessToken) {
  _debug('Fetch with octokit', { path, params, withAccessToken: !!accessToken });
  const octokit = getOctokit(accessToken);
  const func = get(octokit, path);
  return func(params).then(getData);
}

function silentError (err) {
  _debug('Silently catched error', err);
}

function compactRepo (repo) {
  repo = pick(repo, ['id', 'name', 'owner', 'full_name', 'default_branch', 'private', 'language']);
  repo.owner = pick(repo.owner, ['login']);
  return repo;
}

async function fetchProfile (login, accessToken) {
  _debug('Fetch profile', { login: login, withAccessToken: !!accessToken } );

  const cacheKey = `profile_${login}`;

  const profile = cache.get(cacheKey);
  if (profile) {
    return profile;
  }

  // https://octokit.github.io/rest.js/#api-Users-getForUser
  const user = await fetchWithOctokit('users.getForUser', { username: login }, accessToken).catch(silentError);
  if (user && user.type !== 'Organization') {
    cache.set(cacheKey, user);
    return user;
  }

  // https://octokit.github.io/rest.js/#api-Orgs-get
  const org = await fetchWithOctokit('orgs.get', { org: login }, accessToken).catch(silentError);
  if (org) {
    cache.set(cacheKey, org);
    return org;
  }

  return null;
}

async function fetchReposForProfile (profile, accessToken) {
  _debug('Fetch repos for profile', { login: profile.login, withAccessToken: !!accessToken });

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
    // https://octokit.github.io/rest.js/#api-Repos-getForOrg
    getReposPath = 'repos.getForOrg';
    getReposParameters = { org: profile.login };
  } else {
    // https://octokit.github.io/rest.js/#api-Repos-getForUser
    getReposPath = 'repos.getForUser';
    getReposParameters = { username: profile.login };
  }

  // Pagination over all results
  getReposParameters.page = 1;
  getReposParameters.per_page = 100;
  while (true) {
    const fetchRepos = await fetchWithOctokit(getReposPath, getReposParameters, accessToken);
    repos = [ ... repos, ... fetchRepos ];
    if (fetchRepos.length < getReposParameters.per_page) {
      break;
    }
    getReposParameters.page ++;
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

function searchFilesFromRepo (repo, searchPattern, accessToken) {
  _debug('Search files from repo', repo.full_name, repo.default_branch, searchPattern, accessToken);

  if (repo.private === true) {
    // TODO
    throw new Error(`Private repo search not implemented`);
  }

  //search/code?q=filename:*.csproj+repo:joncloud/amp-net
  const relativeUrl = `/search/code?q=filename:${searchPattern}+repo:${repo.full_name}`;
  _debug(`Fetching from ${relativeUrl}`);
  return fetch(`${apiRawUrl}${relativeUrl}`)
    .then(response => {
      if (response.status === 200) {
        return response.json()
      }
      _debug(`Fetched ${relativeUrl}`, response.status, response.text());
      throw new Error(`Can't fetch ${searchPattern} from ${relativeUrl}.`);
    })
    .then(result => result.items)
    .then(items => Promise.all(
      items.map(item => fetchFileFromRepo(repo, item.path, accessToken))
    ));
}

function fetchFileFromRepo (repo, path, accessToken) {
  _debug('Fetch file from repo',
    { repo: repo.full_name, branch: repo.default_branch, path, withAccessToken: !!accessToken });

  if (repo.private === true) {
    const params = { owner: repo.owner.login, repo: repo.name, path: path };
    // https://octokit.github.io/rest.js/#api-Repos-getContent
    return fetchWithOctokit('repos.getContent', params, accessToken).then(getContent);
  }

  const relativeUrl = `/${repo.full_name}/${repo.default_branch}/${path}`;
  _debug(`Fetching file from public repo ${relativeUrl}`);
  return fetch(`${baseRawUrl}${relativeUrl}`)
    .then(response => {
      if (response.status === 200) {
        return response.text();
      }
      throw new Error(`Can't fetch ${path} from ${relativeUrl}.`);
    });
}

function donateToken (accessToken) {
  const donatedTokens = cache.get('donatedTokens') || [];
  if (donatedTokens.indexOf(accessToken) === -1) {
    donatedTokens.push(accessToken);
    cache.set('donatedTokens', donatedTokens);
  }
}

export {
  fetchWithOctokit,
  fetchFileFromRepo,
  fetchProfile,
  fetchReposForProfile,
  donateToken,
  searchFilesFromRepo,
};
