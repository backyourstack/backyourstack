import { flatten } from 'lodash';

import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const strategies = [];
  if (githubRepo.language === 'JavaScript' || githubRepo.language === 'TypeScript') {
    strategies.push(npm.getDependenciesFromGithubRepo(githubRepo, githubAccessToken));
  }
  if (githubRepo.language === 'PHP') {
    strategies.push(composer.getDependenciesFromGithubRepo(githubRepo, githubAccessToken));
  }
  if (githubRepo.language === 'C#') {
    strategies.push(nuget.getDependenciesFromGithubRepo(githubRepo, githubAccessToken));
  }
  return Promise.all(strategies).then(results => {
    return flatten(results, true);
  });
}

function dependenciesStats (file) {
  const type = detectDependencyFileType(file);
  if (type === 'npm') {
    return npm.dependenciesStats(file.json);
  }
  if (type === 'composer') {
    return composer.dependenciesStats(file.json);
  }
  return [];
}

function detectDependencyFileType (file) {
  if (npm.isDependencyFile(file)) {
    return 'npm';
  }
  if (composer.isDependencyFile(file)) {
    return 'composer';
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
};
