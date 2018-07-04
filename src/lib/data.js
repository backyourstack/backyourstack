import debug from 'debug';

import {
  fetchWithOctokit,
  fetchProfile,
  fetchReposForProfile,
} from './github';

import {
  fetchCollective,
} from './opencollective';

import {
  addDependenciesToRepo,
  addProjectToDependencies,
  dependenciesStats,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
} from './utils';

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

function getCollective (profile) {
  const slug = githubToOpenCollectiveMapping[profile.login] || profile.login;
  return fetchCollective(slug);
}

async function getProfileData (id, accessToken) {
  if (process.browser) {
    return fetchJson(`/data/getProfileData?id=${id}`);
  }

  const profile = await fetchProfile(id, accessToken);

  const opencollective = await getCollective(profile);

  const repos = await fetchReposForProfile(profile, accessToken)
    .then(repos =>
      Promise.all(repos.map(repo =>
        addDependenciesToRepo(repo, accessToken))
      )
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
      name: file.parsed.name || 'Unnamed project',
      dependencies: dependenciesStats(file.parsed),
      ... file,
    };
  });

  const dependencies = await addProjectToDependencies(getAllDependenciesFromRepos(repos));

  const recommendations = await getRecommendedProjectFromDependencies(dependencies);

  return { files, repos, dependencies, recommendations };

}

export {
  getProfile,
  searchUsers,
  getUserOrgs,
  getProfileData,
  getFilesData,
};
