import cache from '../cache';
import debug from 'debug';
import { fetchFileFromRepo, searchFilesFromRepo } from '../github';
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

// Assumes dependencyObject is {core: ['dependency', ...], ...}
// or {core: {dependency: ...}, ...}
// Returns [{type: 'npm', name: 'dependency', core: 1}, ...]
function transformToStats (manager, ...dependencyObjects) {
  const index = {};
  dependencyObjects.forEach( dependencies => {
    Object.entries(dependencies).forEach(([ dependencyType, dependencyNames ]) => {
      if (dependencyNames) {
        if (!Array.isArray(dependencyNames)) { // Transform {dependency: ...} into ['dependency', ...]
          dependencyNames = Object.keys(dependencyNames);
        }
        dependencyNames.forEach(name => {
          index[name] = index[name] || { type: manager, name };
          index[name][dependencyType] = 1;
        });
      }
    });
  });
  return Object.values(index);
}

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
  const manager = dependencyManagers[fileType];
  const query = manager.searchAllRepo ? searchFilesFromRepo :
    (repo, path, accessToken) => fetchFileFromRepo (repo, path, accessToken).then( content => [content] );

  // lookup returns a promise returning [{matchedPattern, content}]
  function lookup (pattern) {
    return query(githubRepo, pattern, githubAccessToken).then (
      contents => contents.map(text => ({
              matchedPattern: pattern,
              text,
            }))
    );
  }

  const firstSetOfMatchingFiles = manager.patterns.reduce(
    (promise, pattern) => promise.then (
      results => results.length ? results : lookup(pattern)
    ), Promise.resolve([])
  );

  return firstSetOfMatchingFiles
  .then( files => files.map(manager.dependencies) )
  .then( dependencyObjects => transformToStats(fileType, ...dependencyObjects) )
  .catch(err => {
    _debug(`${fileType}.getDependenciesFromGithubRepo error: ${err.message}`);
    return [];
  });
}

function dependenciesStats (file) {
  const manager = findManager(file);
  if (manager) {
    return transformToStats(file.type, manager.dependencies(file));
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
  const manager = findManager(file);
  if (manager) {
    return manager.detectProjectName(file);
  }
}

function findManager (file) {
  if (!file.type) {
    detectDependencyFileType(file);
  }
  return dependencyManagers[file.type];
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
  detectProjectName,
};
