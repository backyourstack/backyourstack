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

export async function getFirstMatchingFiles(
  manager,
  githubRepo,
  githubAccessToken,
) {
  for (const pattern of manager.patterns) {
    let files;
    if (manager.searchAllRepo) {
      files = await searchFilesFromRepo(githubRepo, pattern, githubAccessToken);
    } else {
      files = await fetchFileFromRepo(githubRepo, pattern, githubAccessToken)
        .then(file => [file])
        .catch(() => []);
    }
    if (files.length) {
      return files.map(({ content, fileUrl }) => ({
        matchedPattern: pattern,
        text: content,
        fileUrl: fileUrl,
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
