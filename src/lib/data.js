import debug from 'debug';

import fetch from 'cross-fetch';

import {
  fetchWithOctokit,
  fetchProfile,
  fetchReposForProfile,
} from './github';

import {
  fetchCollectiveWithBacking,
} from './opencollective';

import {
  addProjectToDependencies,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
} from './utils';

import {
  getDependenciesFromGithubRepo,
  dependenciesStats,
} from './dependencies';

import githubToOpenCollectiveMapping from '../data/githubToOpenCollectiveMapping.json';

const _debug = debug('data');

function fetchDebug (result) {
  _debug(result);
  return result;
}

function fetchJson (url, params = {}) {
  params.credentials = 'same-origin';
  return fetch(url, params)
    .then(res => res.json())
    .then(fetchDebug);
}

function getProfile (slug, accessToken) {
  return process.browser ?
    fetchJson(`/data/getProfile?slug=${slug}`) :
    fetchProfile(slug, accessToken);
}

function getUserOrgs (accessToken) {
  return process.browser ?
    fetchJson('/data/getUserOrgs') :
    fetchWithOctokit('users.getOrgs', {}, accessToken);
}

function searchUsers (q, accessToken) {
  return process.browser ?
    fetchJson(`/data/searchUsers?q=${q}`) :
    fetchWithOctokit('search.users', { q }, accessToken);
}

function getCollectiveWithBacking (profile) {
  const slug = githubToOpenCollectiveMapping[profile.login] || profile.login;
  return fetchCollectiveWithBacking(slug);
}

async function getProfileData (id, accessToken) {
  if (process.browser) {
    return fetchJson(`/data/getProfileData?id=${id}`);
  }

  const profile = await fetchProfile(id, accessToken);

  const opencollective = await getCollectiveWithBacking(profile);

  const repos = await fetchReposForProfile(profile, accessToken)
    .then(repos =>
      Promise.all(repos.map(async repo => {
        repo.dependencies = await getDependenciesFromGithubRepo(repo, accessToken);
        return repo;
      }))
    );

  const dependencies = await addProjectToDependencies(getAllDependenciesFromRepos(repos));

  const recommendations = await getRecommendedProjectFromDependencies(dependencies);

  return { profile, opencollective, repos, dependencies, recommendations };
}

async function getFilesData (sessionFiles) {
  if (process.browser) {
    return fetchJson('/data/getFilesData');
  }

  if (!sessionFiles) {
    return { files: {}, repos: [], dependencies: [], recommendations: [] };
  }

  const files = sessionFiles;

  const repos = Object.keys(sessionFiles).map(id => {
    const file = sessionFiles[id];
    return {
      id,
      name: file.projectName || 'Unnamed project',
      dependencies: dependenciesStats(file),
      ... file,
    };
  });

  const dependencies = await addProjectToDependencies(getAllDependenciesFromRepos(repos));

  const recommendations = await getRecommendedProjectFromDependencies(dependencies);

  return { files, repos, dependencies, recommendations };
}

function emailSubscribe (email, profile) {
  if (process.browser) {
    return fetchJson('/data/emailSubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({ email, profile }),
    });
  }

  const username = 'anystring';
  const password = process.env.MAILCHIMP_API_KEY;

  const basicAuthenticationString = Buffer.from([username, password].join(':')).toString('base64');

  return fetch(process.env.MAILCHIMP_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${basicAuthenticationString}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      members : [
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            PROFILE: profile,
          },
        },
      ],
      update_existing: true,
    }),
  });
}

export {
  getProfile,
  searchUsers,
  getUserOrgs,
  getProfileData,
  getFilesData,
  emailSubscribe,
};
