import { flatten } from 'lodash';

import * as composer from './composer';
import * as npm from './npm';

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  return Promise.all([
    npm.getDependenciesFromGithubRepo(githubRepo, githubAccessToken),
    composer.getDependenciesFromGithubRepo(githubRepo, githubAccessToken),
  ]).then(results => {
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
