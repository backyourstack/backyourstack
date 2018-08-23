import cache from '../cache';
import debug from 'debug';
import minimatch from 'minimatch';

import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';

const _debug = debug('dependencies');

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
};

const languageToFileType = {
  JavaScript: 'npm',
  TypeScript: 'npm',
  PHP: 'composer',
  'C#': 'nuget',
  'Go': 'dep',
};

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const fileType = languageToFileType[githubRepo.language];
  if (!fileType) {
    return Promise.resolve([]);
  }
  const cacheKey = `repo_${fileType}_dependencies_${githubRepo.id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  return loadDependenciesFromGithubRepo (fileType, githubRepo, githubAccessToken)
    .then(result => {
      cache.set(cacheKey, result);
      return result;
    });
}

function loadDependenciesFromGithubRepo (fileType, githubRepo, githubAccessToken) {
  return dependencyManagers[fileType].getDependenciesFromGithubRepo(githubRepo, githubAccessToken)
    .catch(err => {
      _debug(`${fileType}.getDependenciesFromGithubRepo error: ${err.message}`);
      return [];
    });
}

function dependenciesStats (file) {
  if (file.type === 'npm') {
    return npm.dependenciesStats(file.json);
  }
  if (file.type === 'composer') {
    return composer.dependenciesStats(file.json);
  }
  if (file.type === 'nuget') {
    return nuget.dependenciesStats(file);
  }
  if (file.type === 'dep') {
    return dep.dependenciesStats(file.text);
  }
  return [];
}

// Returns `file` or undefined if file is not a recognized dependency file.
function detectDependencyFileType (file) {
  for (const type in dependencyManagers) {
    for (const matchedPattern of dependencyManagers[type].patterns) {
      if (minimatch(file.name, matchedPattern)) {
        return Object.assign(file, { type, matchedPattern });
      }
    }
  }
}

function detectProjectName (file) {
  if (!file.type) {
    detectDependencyFileType(file);
  }
  const manager = dependencyManagers[file.type];
  if (manager) {
    return manager.detectProjectName(file);
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
  detectProjectName,
};
