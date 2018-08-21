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
  if (file.type === 'npm') {
    return npm.dependenciesStats(file.json);
  }
  if (file.type === 'composer') {
    return composer.dependenciesStats(file.json);
  }
  if (file.type === 'nuget') {
    return nuget.dependenciesStats(file);
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
  if (nuget.isDependencyFile(file)) {
    return 'nuget';
  }
}

function detectProjectName (file) {
  if (file.type === 'npm') {
    return npm.detectProjectName(file);
  }
  if (file.type === 'composer') {
    return composer.detectProjectName(file);
  }
  if (file.type === 'nuget') {
    return nuget.detectProjectName(file);
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
  detectProjectName,
};
