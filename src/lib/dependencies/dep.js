import debug from 'debug';

import cache from '../cache';

import toml from 'toml';

import { fetchFileFromRepo } from '../github';

const _debug = debug('dependencies:dep');

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const cacheKey = `repo_dep_dependencies_${githubRepo.id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  return fetchFileFromRepo(githubRepo, 'Gopkg.lock', githubAccessToken)
    .then(dependenciesStats)
    .catch(err => {
      _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
      return [];
    })
    .then(result => {
      cache.set(cacheKey, result);
      return result;
    });
}

function dependenciesStats (file) {
  const data = toml.parse(file)
  const dependencies = {};
  data.projects.map(proj => proj.name).forEach(name => {
    dependencies[name] = dependencies[name] || {
      type: 'dep',
      name: name,
      core: 1
    };
  });
  return Object.values(dependencies);
}

function isDependencyFile (file) {
  return file.name === 'Gopkg.lock'
}

function detectProjectName () {
  return "not defined"
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  isDependencyFile,
  detectProjectName,
};
