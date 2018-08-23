import { flatten } from 'lodash';

import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';

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
  if (githubRepo.language === 'Go') {
    strategies.push(dep.getDependenciesFromGithubRepo(githubRepo, githubAccessToken));
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
  if (file.type === 'dep') {
    return dep.dependenciesStats(file.text);
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
  if (dep.isDependencyFile(file)) {
    return 'dep';
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
  if (file.type === 'dep') {
    return dep.detectProjectName(file);
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
  detectProjectName,
};
