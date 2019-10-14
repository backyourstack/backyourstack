import logger from '../../logger';

import cache from '../cache';
import { fetchFileFromRepo, searchFilesFromRepo } from '../github';

import dependencyManagers from './dependency-managers';
import { transformToStats } from './utils';

const languageToFileType = {
  JavaScript: 'npm',
  TypeScript: 'npm',
  PHP: 'composer',
  'C#': 'nuget',
  Go: 'dep',
  Ruby: 'bundler',
  Python: 'pypi',
};

export function getDependenciesFromGithubRepo(githubRepo, githubAccessToken) {
  const fileType = languageToFileType[githubRepo.language];
  if (!fileType) {
    return Promise.resolve([]);
  }
  const cacheKey = `repo_${fileType}_dependencies_${githubRepo.id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }
  return loadDependenciesFromGithubRepo(
    fileType,
    githubRepo,
    githubAccessToken,
  ).then(result => {
    cache.set(cacheKey, result);
    return result;
  });
}

export function fetchDependenciesFileContent(githubRepo, githubAccessToken) {
  const fileType = languageToFileType[githubRepo.language];
  const manager = dependencyManagers[fileType];
  return getFirstMatchingFiles(manager, githubRepo, githubAccessToken).catch(
    err => {
      logger.error(
        `${fileType}.getDependenciesFromGithubRepo error: ${err.message}`,
      );
      return [];
    },
  );
}

export async function getFirstMatchingFiles(
  manager,
  githubRepo,
  githubAccessToken,
) {
  for (const pattern of manager.patterns) {
    let fileContents;
    if (manager.searchAllRepo) {
      fileContents = await searchFilesFromRepo(
        githubRepo,
        pattern,
        githubAccessToken,
      );
    } else {
      fileContents = await fetchFileFromRepo(
        githubRepo,
        pattern,
        githubAccessToken,
      )
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

export function loadDependenciesFromGithubRepo(
  fileType,
  githubRepo,
  githubAccessToken,
) {
  const manager = dependencyManagers[fileType];

  return getFirstMatchingFiles(manager, githubRepo, githubAccessToken)
    .then(files => files.map(manager.dependencies))
    .then(dependencyObjects => transformToStats(fileType, ...dependencyObjects))
    .catch(err => {
      logger.error(
        `${fileType}.getDependenciesFromGithubRepo error: ${err.message}`,
      );
      return [];
    });
}
