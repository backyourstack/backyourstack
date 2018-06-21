import _debug from 'debug';

import fetch from 'cross-fetch';
import octokitRest from '@octokit/rest';

import { get, pick } from 'lodash';

import cache from './cache';

const debug = _debug('github');

const baseRawUrl = 'https://raw.githubusercontent.com';

function getOctokit (accessToken) {
  const octokit = octokitRest();
  if (accessToken) {
    octokit.authenticate({ type: 'oauth', token: accessToken });
  }
  return octokit;
}

function getData (res) {
  debug(`RateLimit Remaining: ${res.headers['x-ratelimit-remaining']}`);
  return res.data;
}

function getContent (data) {
  return Buffer.from(data.content, 'base64').toString('utf8');
}

function fetchWithOctokit (path, params, accessToken) {
  debug('Fetch with octokit', { path, params, accessToken });
  const octokit = getOctokit(accessToken);
  const func = get(octokit, path);
  return func(params).then(getData);
}

function silentError (err) {
  debug('Silently catched error', err);
}

async function fetchProfile (slug, accessToken) {
  debug('Fetch profile', slug, accessToken);

  const cacheKey = `profile_${slug}`;

  const profile = cache.get(cacheKey);
  if (profile) {
    return profile;
  }

  const user = await fetchWithOctokit('users.getForUser', { username: slug }, accessToken).catch(silentError);
  if (user && user.type !== 'Organization') {
    cache.set(cacheKey, user);
    return user;
  }

  const org = await fetchWithOctokit('orgs.get', { org: slug }, accessToken);
  if (org) {
    cache.set(cacheKey, org);
    return org;
  }
}

async function fetchReposForProfile (profile, accessToken) {
  debug('Fetch repos for profile', profile, accessToken);

  let repos = [];

  const publicCacheKey = `profile_repos_${profile.login}`;
  if (!accessToken && cache.has(publicCacheKey)) {
    return cache.get(publicCacheKey);
  }

  let getReposPath, getReposParameters;
  if (profile.type == 'Organization') {
    getReposPath = 'repos.getForOrg';
    getReposParameters = { org: profile.login };
  } else {
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

  // Filter the keys we're interested in
  repos = repos.map(repo => pick(repo, ['id', 'name', 'owner', 'full_name', 'default_branch', 'private']));

  const publicRepos = repos.filter(repo => repo.private === false);

  // Save in Public Cache
  cache.set(publicCacheKey, publicRepos);

  return accessToken ? repos : publicRepos;
}


function fetchFileFromRepo (repo, path, accessToken) {
  debug('Fetch file from repo', repo.full_name, repo.default_branch, path, accessToken);

  if (repo.private === true) {
    const params = { owner: repo.owner.login, repo: repo.name, path: path };
    return fetchWithOctokit('repos.getContent', params, accessToken).then(getContent);
  }

  const relativeUrl = `/${repo.full_name}/${repo.default_branch}/${path}`;
  debug(`Fetching from ${relativeUrl}`);
  return fetch(`${baseRawUrl}${relativeUrl}`)
    .then(response => {
      if (response.status === 200) {
        return response.text();
      }
      throw new Error(`Can't fetch package.json from ${relativeUrl}.`);
    });
}

export {
  fetchWithOctokit,
  fetchFileFromRepo,
  fetchProfile,
  fetchReposForProfile,
};
