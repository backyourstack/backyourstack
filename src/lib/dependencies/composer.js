import debug from 'debug';

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
  return fetchFileFromRepo(githubRepo, 'composer.json', githubAccessToken)
    .then(JSON.parse)
    .then(dependenciesStats)
    .catch(err => {
      _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
      return [];
    });
}

function isDependencyFile (file) {
  if (file.json) {
    if (file.json['require'] || file.json['require-dev']) {
      return true;
    }
  }
}

function detectProjectName (file) {
  return file.json && file.json.name;
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  isDependencyFile,
  detectProjectName,
};
