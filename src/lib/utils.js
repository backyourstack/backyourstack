import debug from 'debug';
import { pick } from 'lodash';

import cache from './cache';
import { fetchFileFromRepo } from './github';

import allProjects from '../data/projects.json';

const _debug = debug('utils');

const dependencyTypes = ['dependencies', 'peerDependencies', 'devDependencies'];

async function addDependenciesToRepo (repo, accessToken) {
  const cacheKey = `repo_raw_dependencies_${repo.id}`;

  let rawDependencies;
  if (cache.has(cacheKey)) {
    rawDependencies = cache.get(cacheKey);
  } else {
    rawDependencies = await fetchRepoDependencies(repo, accessToken);
    cache.set(cacheKey, rawDependencies);
  }

  repo.dependencies = dependenciesStats(rawDependencies);

  return repo;
}

function fetchRepoDependencies (repo, accessToken) {
  return fetchFileFromRepo(repo, 'package.json', accessToken)
    .then(JSON.parse)
    .catch(err => {
      _debug(`fetchRepoDependencies error: ${err.message}`);
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
      dependencies[id]['repos'][repo.id] = pick(repo, ['id', 'name', 'full_name']);
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
            projects[id]['repos'] = [];
          }
          dep.repos.forEach(repo => projects[id]['repos'][repo.id] = repo);
        }

        // Convert objects with ids as key to arrays
        return Object.values(projects).map(project => {
          project.repos = Object.values(project.repos);
          return project;
        });
      }
    ).then(
      projects => {
        return projects.sort((a, b) =>
          a.repos.length != b.repos.length ? b.repos.length - a.repos.length : a.name.localeCompare(b.name)
        );
      }
    ).then(
      recommendations => recommendations.filter(r => r.opencollective)
    );
}

export {
  addDependenciesToRepo,
  addProjectToDependencies,
  dependenciesStats,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
};
