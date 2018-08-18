import debug from 'debug';

import cache from '../cache';

import { fetchFileFromRepo } from '../github';

const _debug = debug('dependencies:composer');

const dependencyTypes = {
  core: 'require',
  dev: 'require-dev',
};

function dependenciesStats (composerJson) {
  const dependencies = {};
  Object.entries(dependencyTypes).forEach(([ dependencyType, dependencyKey ]) => {
    if (composerJson[dependencyKey]) {
      Object.keys(composerJson[dependencyKey]).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'composer', name };
        dependencies[name][dependencyType] = 1;
      });
    }
  });
  return Object.values(dependencies);
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const cacheKey = `repo_composer_dependencies_${githubRepo.id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  return fetchFileFromRepo(githubRepo, 'composer.json', githubAccessToken)
    .then(JSON.parse)
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

function isDependencyFile (file) {
  if (file.json) {
    if (file.json['require'] || file.json['require-dev']) {
      return true;
    }
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  isDependencyFile,
};
