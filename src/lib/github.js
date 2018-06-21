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
  debug('Fetch with Octokit', { path, params, accessToken });
  const octokit = getOctokit(accessToken);
  const func = get(octokit, path);
  return func(params).then(getData);
}

async function fetchProfile (slug, accessToken) {
  debug('Fetch profile', { slug, accessToken });
  const cacheKey = `profile_${slug}`;
  const profile = cache.get(cacheKey);
  if (profile) {
    return profile;
  }
  const user = await fetchWithOctokit('users.getForUser', { username: slug }, accessToken).catch(() => null);

  if (!user || user.type === 'Organization') {
    const org = fetchWithOctokit('orgs.get', { org: slug }, accessToken);
    cache.set(cacheKey, org);
    return org;
  } else {
    cache.set(cacheKey, user);
    return user;
  }
}

async function fetchReposForProfile (profile, accessToken) {

  let repos = [];

  const publicCacheKey = `profile_repos_${profile.login}`;
  if (!accessToken && cache.has(publicCacheKey)) {
    repos = cache.get(publicCacheKey);
  } else {
    const perPage = 100;

    let getRepoFunction, getRepoParameters;
    if (profile.type == 'Organization') {
      getRepoFunction = 'repos.getForOrg';
      getRepoParameters = { org: profile.login };
    } else {
      getRepoFunction = 'repos.getForUser';
      getRepoParameters = { username: profile.login };
    }

    getRepoParameters.page = 1;
    getRepoParameters.per_page = perPage;
    while (true) {
      debug('Fetching repos', getRepoParameters);
      const fetchRepos = await fetchWithOctokit(getRepoFunction, getRepoParameters, accessToken);
      repos = [ ... repos, ... fetchRepos ];
      if (fetchRepos.length < perPage) {
        break;
      }
      getRepoParameters.page ++;
    }

    // Filter the keys we're interested in
    repos = repos.map(repo => pick(repo, ['id', 'name', 'owner', 'full_name', 'default_branch', 'private']));

    // Save in Public Cache
    cache.set(publicCacheKey, repos.filter(repo => repo.private === false));
  }

  return repos;
}


function fetchRepoFile (repo, path, accessToken) {
  if (repo.private === false) {
    const relativeUrl = `/${repo.full_name}/${repo.default_branch}/${path}`;
    debug(`Fetching from ${relativeUrl}`);
    return fetch(`${baseRawUrl}${relativeUrl}`)
      .then(response => {
        if (response.status === 200) {
          return response.text();
        }
        throw new Error(`Can't fetch package.json from ${relativeUrl}.`);
      });
  } else if (repo.private === true) {
    const params = { owner: repo.owner.login, repo: repo.name, path: path };
    return fetchWithOctokit('repos.getContent', params, accessToken).then(getContent);
  }
}

export {
  fetchWithOctokit,
  fetchRepoFile,
  fetchProfile,
  fetchReposForProfile,
};
