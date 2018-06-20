import _debug from 'debug';

import { pick, uniq } from 'lodash';

import allProjects from '../data/projects.json';

import {
  fetchRepoFile,
} from './github';

import cache from './cache';

const debug = _debug('utils');

const dependencyTypes = ['dependencies', 'peerDependencies', 'devDependencies'];

function addDependenciesToRepo (repo, accessToken) {
  return new Promise(resolve => {
    const cacheKey = `repo_dependencies_${repo.id}`;
    if (cache.has(cacheKey)) {
      repo.dependencies = cache.get(cacheKey);
      resolve(repo);
    } else {
      fetchRepoDependencies(repo, accessToken)
        .then(dependencies => {
          cache.set(cacheKey, dependencies);
          repo.rawDependencies = dependencies;
          repo.dependencies = dependenciesStats(dependencies);
          resolve(repo);
        });
    }
  });
}

function fetchRepoDependencies (repo, accessToken) {
  return fetchRepoFile(repo, 'package.json', accessToken)
    .then(JSON.parse)
    .catch((err) => {
      debug(`Error: ${err.message}`);
      return [];
    });
}

function dependenciesStats (packageJson) {
  const dependencies = {};
  dependencyTypes.forEach(dependencyType => {
    if (packageJson[dependencyType]) {
      Object.keys(packageJson[dependencyType]).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'npm', name };
        dependencies[name][dependencyType] = dependencies[name][dependencyType] || 0;
        dependencies[name][dependencyType] ++;
      });
    }
  });
  return Object.values(dependencies);
}

function getProjectFromDependency (dependency) {
  return allProjects.find(project =>
    project.packages.find(pkg => pkg.name === dependency)
  );
}

function getAllDependenciesFromRepos (repos) {
  const dependencies = [];

  for (const repo of repos) {
    for (const dependency of repo.dependencies) {
      const id = `${dependency.type}_${dependency.name}`;
      dependencies[id] = dependencies[id] || pick(dependency, ['type', 'name']);
      // Count all occurences of each dependency
      for (const dependencyType of dependencyTypes) {
        dependencies[id][dependencyType] = dependencies[id][dependencyType] || 0;
        if (dependency[dependencyType]) {
          dependencies[id][dependencyType] += dependency[dependencyType];
        }
      }
      // Keep track of repos
      dependencies[id]['repos'] = dependencies[id]['repos'] || {};
      dependencies[id]['repos'][repo.id] = repo;
    }
  }

  // Convert objects with ids as key to arrays
  return Object.values(dependencies).map(dependency => {
    dependency.repos = Object.values(dependency.repos);
    return dependency;
  });
}

function addProjectToDependencies (deps) {
  return Promise.all(
    deps.map(
      dep => addProjectToDependency(dep)
    )
  );
}

function addProjectToDependency (dep) {
  const project = getProjectFromDependency(dep.name);
  if (project) {
    dep.project = project;
  }
  return dep;
}

function getRecommendedProjectFromDependencies (deps) {
  return addProjectToDependencies(deps)
    .then(
      deps => {
        const projects = {};

        for (const dep of deps) {
          const id = dep.project ? dep.project.name : dep.name;
          if (!projects[id]) {
            projects[id] = dep.project ? pick(dep.project, ['name', 'opencollective']) : pick(dep, ['name']);
            projects[id].score = 0;
            projects[id].repos = [];
          }
          projects[id].repos = uniq([... projects[id].repos, ... dep.repos]);
          for (const dependencyType of dependencyTypes) {
            projects[id][dependencyType] = projects[id][dependencyType] || 0;
            projects[id][dependencyType] += dep[dependencyType];
            // Score
            if (dependencyType === 'dependencies') {
              projects[id].score += dep[dependencyType] * 3;
            } else {
              projects[id].score += dep[dependencyType];
            }
          }
        }

        // Convert objects with ids as key to arrays
        return Object.values(projects);
      }
    ).then(
      projects => {
        return projects.sort((a, b) =>
          a.score != b.score ? b.score - a.score : a.name.localeCompare(b.name)
        );
      }
    );
}

export {
  addDependenciesToRepo,
  addProjectToDependencies,
  dependenciesStats,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
};
