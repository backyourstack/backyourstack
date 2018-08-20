import debug from 'debug';

import { fetchFileFromRepo } from '../github';

const _debug = debug('dependencies:npm');

const dependencyTypes = {
  core: 'dependencies',
  peer: 'peerDependencies',
  dev: 'devDependencies',
  engines: 'engines',
};

function dependenciesStats (packageJson) {
  const dependencies = {};
  Object.entries(dependencyTypes).forEach(([ dependencyType, dependencyKey ]) => {
    if (packageJson[dependencyKey]) {
      Object.keys(packageJson[dependencyKey]).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'npm', name };
        dependencies[name][dependencyType] = 1;
      });
    }
  });
  return Object.values(dependencies);
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  return fetchFileFromRepo(githubRepo, 'package.json', githubAccessToken)
    .then(JSON.parse)
    .then(dependenciesStats)
    .catch(err => {
      _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
      return [];
    });
}

function isDependencyFile (file) {
  if (file.json) {
    if (file.json.dependencies || file.json.devDependencies || file.json.peerDependencies) {
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
