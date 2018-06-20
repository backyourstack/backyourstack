import _debug from 'debug';
import lruCache from 'lru-cache';

import fetch from 'cross-fetch';
import octokitRest from '@octokit/rest';

import { get, pick } from 'lodash';

const cache = lruCache();

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
  const octokit = getOctokit(accessToken);
  const func = get(octokit, path);
  return func(params).then(getData);
}

async function fetchProfile (slug, accessToken) {
  const cacheKey = `profile_${slug}`;
  const profile = cache.get(cacheKey);
  if (profile) {
    return profile;
  }
  const octokit = getOctokit(accessToken);
  const user = await octokit.users.getForUser({ username: slug })
    .then(getData)
    .catch(() => null);

  if (!user || user.type === 'Organization') {
    const org = await octokit.orgs.get({ org: slug }).then(getData);
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
    const octokit = getOctokit(accessToken);

    let getRepoFunction, getRepoParameters;
    if (profile.type == 'Organization') {
      getRepoFunction = octokit.repos.getForOrg;
      getRepoParameters = { org: profile.login };
    } else {
      getRepoFunction = octokit.repos.getForUser;
      getRepoParameters = { username: profile.login };
    }

    getRepoParameters.page = 1;
    getRepoParameters.per_page = perPage;
    while (true) {
      debug('Fetching repos', getRepoParameters);
      const fetchRepos = await getRepoFunction(getRepoParameters).then(getData);
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

  // Add dependencies
  return Promise.all(repos.map(repo => addDependenciesToRepo(repo, accessToken)));
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
    const octokit = getOctokit(accessToken);
    const params = { owner: repo.owner.login, repo: repo.name, path: path };
    debug('Fetching with Octokit', params);
    return octokit.repos
      .getContent(params)
      .then(getData)
      .then(getContent);
  }
}

function fetchRepoDependencies (repo, accessToken) {
  return fetchRepoFile(repo, 'package.json', accessToken)
      .then(JSON.parse)
      .then(packageJson => {
        const dependencies = {};
        ['dependencies', 'devDependencies', 'peerDependencies'].forEach(dependencyType => {
          if (packageJson[dependencyType]) {
            Object.keys(packageJson[dependencyType]).forEach(name => {
              dependencies[name] = dependencies[name] || { type: 'npm', name };
              dependencies[name][dependencyType] = dependencies[name][dependencyType] || 0;
              dependencies[name][dependencyType] ++;
            });
          }
        });
        return Object.values(dependencies);
      })
      .catch((err) => {
        debug(`Error: ${err.message}`);
        return [];
      });
}

function addDependenciesToRepo (repo, accessToken) {
  return new Promise(resolve => {
    const cacheKey = `repo_dependencies_${repo.id}`;
    if (cache.has(cacheKey)) {
      repo.dependencies = cache.get(cacheKey);
      resolve(repo);
    } else {
      fetchRepoDependencies(repo, accessToken).then(dependencies => {
        cache.set(cacheKey, dependencies);
        repo.dependencies = dependencies;
        resolve(repo);
      });
    }
  });
}

export {
  fetchWithOctokit,
  fetchProfile,
  fetchReposForProfile,
};
