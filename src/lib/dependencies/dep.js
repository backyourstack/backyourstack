import debug from 'debug';

import cache from '../cache';

import toml from 'toml';

import { fetchFileFromRepo } from '../github';

const _debug = debug('dependencies:dep');

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  console.log('lets goooo')
  const cacheKey = `repo_dep_dependencies_${githubRepo.id}`;
  // if (cache.has(cacheKey)) {
  //   return cache.get(cacheKey);
  // }
  return fetchFileFromRepo(githubRepo, 'Gopkg.lock', githubAccessToken)
    .then(dependenciesStats)
    .catch(err => {
      _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
      return [];
    })
    .then(result => {
      console.log('here we go:')
      console.dir(result)
      cache.set(cacheKey, result);
      return result;
    });
}

function dependenciesStats (file) {
  console.log("file: " + file)
  const data = toml.parse(file)
  console.dir(data);
  const dependencies = {};
  data.projects.map(proj => proj.name).forEach(name => {
    console.log("adding " + name)
    dependencies[name] = dependencies[name] || {
      type: 'dep',
      name: name,
      core: 1
    };
  });
  return Object.values(dependencies);
}

function isDependencyFile (file) {
  return file.name === 'Gopkg.lock'
}

function detectProjectName (file) {
  return "not defined"
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  isDependencyFile,
  detectProjectName,
};
