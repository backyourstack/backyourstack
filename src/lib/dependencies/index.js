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

function dependenciesStats (parsedJson) {
  if (parsedJson.dependencies || parsedJson.devDependencies || parsedJson.peerDependencies) {
    return npm.dependenciesStats(parsedJson);
  }
  if (parsedJson.require || parsedJson['require-dev']) {
    return composer.dependenciesStats(parsedJson);
  }
  return [];
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
};
