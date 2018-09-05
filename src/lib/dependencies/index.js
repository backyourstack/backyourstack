import minimatch from 'minimatch';

import logger from '../../logger';

import cache from '../cache';
import { fetchFileFromRepo, searchFilesFromRepo } from '../github';

import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';
import * as bundler from './bundler';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
  bundler,
};

const languageToFileType = {
  'JavaScript': 'npm',
  'TypeScript': 'npm',
  'PHP': 'composer',
  'C#': 'nuget',
  'Go': 'dep',
  'Ruby': 'bundler',
};

const supportedFiles = [
  'package.json',
  'composer.json',
  '*.csproj',
  'packages.config',
  'Gopkg.lock',
  'Gemfile.lock',
];

// Assumes dependencyObject is {core: ['dependency', ...], ...}
// Returns [{type: 'npm', name: 'dependency', core: 1}, ...]
function transformToStats (manager, ...dependencyObjects) {
  const index = {};
  dependencyObjects.forEach( dependencies => {
    Object.entries(dependencies).forEach(([ dependencyType, dependencyNames ]) => {
      dependencyNames.forEach(name => {
        index[name] = index[name] || { type: manager, name };
        index[name][dependencyType] = 1;
      });
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

async function getFirstMatchingFiles (manager, githubRepo, githubAccessToken) {
  for (const pattern of manager.patterns) {
    let fileContents;
    if (manager.searchAllRepo) {
      fileContents = await searchFilesFromRepo(githubRepo, pattern, githubAccessToken);
    } else {
      fileContents = await fetchFileFromRepo(githubRepo, pattern, githubAccessToken)
        .then(content => [content])
        .catch(() => []);
    }

    if (fileContents.length) {
      return fileContents.map(text => ({
        matchedPattern: pattern,
        text,
      }));
    }
  }

  return [];
}

function loadDependenciesFromGithubRepo (fileType, githubRepo, githubAccessToken) {
  const manager = dependencyManagers[fileType];

  return getFirstMatchingFiles(manager, githubRepo, githubAccessToken)
    .then(files => files.map(manager.dependencies))
    .then(dependencyObjects => transformToStats(fileType, ...dependencyObjects))
    .catch(err => {
      logger.error(`${fileType}.getDependenciesFromGithubRepo error: ${err.message}`);
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
  supportedFiles,
};
