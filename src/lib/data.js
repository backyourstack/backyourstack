import _debug from 'debug';

import {
  fetchWithOctokit,
  fetchProfile,
  fetchReposForProfile,
} from './github';

import {
  addProjectToDependencies,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
} from './utils';

const debug = _debug('data');

const fetchDebug = (result) => {
  debug(result);
  return result;
};

const fetchJson = (url, params = {}) => {
  params.credentials = 'same-origin';
  return fetch(url, params)
    .then(res => res.json())
    .then(fetchDebug);
}

async function getProfile(slug, accessToken) {
  return process.browser ?
    fetchJson(`/data/getProfile?slug=${slug}`) :
    fetchProfile(slug, accessToken);
}

async function getUserOrgs(accessToken) {
  return process.browser ?
    fetchJson(`/data/getUserOrgs`) :
    fetchWithOctokit('users.getOrgs', {}, accessToken);
}

async function searchUsers(q, accessToken) {
  return process.browser ?
    fetchJson(`/data/searchUsers?q=${q}`) :
    fetchWithOctokit('search.users', { q }, accessToken);
}

async function getProfileData(id, accessToken) {
  if (process.browser) {
    return fetchJson(`/data/getProfileData?id=${id}`);
  }

  const profile = await fetchProfile(id, accessToken);
  const repos = await fetchReposForProfile(profile, accessToken);
  const dependencies = await getAllDependenciesFromRepos(repos).then(addProjectToDependencies);
  const recommendations = await getRecommendedProjectFromDependencies(dependencies);

  return { profile, repos, dependencies, recommendations };
}

export {
  getProfile,
  searchUsers,
  getUserOrgs,
  getProfileData,
};
