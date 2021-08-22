import { pick } from 'lodash';

import allProjects from '../data/projects.json';

import fetch from 'cross-fetch';

export const fetchWithBasicAuthentication =
  (username, password) => (url, params) => {
    const basicAuthenticationString = Buffer.from(
      [username, password].join(':'),
    ).toString('base64');
    params.headers = params.headers || {};
    params.headers.Authorization = `Basic ${basicAuthenticationString}`;
    return fetch(url, params);
  };

const dependencyTypes = ['core', 'peer', 'dev', 'engines'];

function getProjectFromDependency(name, type) {
  return allProjects.find((project) =>
    project.packages.find(
      (pkg) =>
        pkg.name.toLowerCase() === name.toLowerCase() && pkg.type === type,
    ),
  );
}

export function getAllDependenciesFromRepos(repos) {
  const dependencies = [];

  for (const repo of repos) {
    for (const dependency of repo.dependencies) {
      const id = `${dependency.type}_${dependency.name}`;
      dependencies[id] = dependencies[id] || pick(dependency, ['type', 'name']);
      // Count all occurences of each dependency
      for (const dependencyType of dependencyTypes) {
        dependencies[id][dependencyType] =
          dependencies[id][dependencyType] || 0;
        if (dependency[dependencyType]) {
          dependencies[id][dependencyType] += dependency[dependencyType];
        }
      }
      // Keep track of repos
      dependencies[id]['repos'] = dependencies[id]['repos'] || {};
      dependencies[id]['repos'][repo.id] = pick(repo, [
        'id',
        'name',
        'full_name',
      ]);
    }
  }

  // Convert objects with ids as key to arrays
  return Object.values(dependencies).map((dependency) => {
    dependency.repos = Object.values(dependency.repos);
    return dependency;
  });
}

export function addProjectToDependencies(deps) {
  return Promise.all(deps.map((dep) => addProjectToDependency(dep)));
}

function addProjectToDependency(dep) {
  const project = getProjectFromDependency(dep.name, dep.type);
  if (project) {
    dep.project = project;
  }
  return dep;
}

export function getRecommendedProjectFromDependencies(deps) {
  return addProjectToDependencies(deps)
    .then((deps) => {
      const projects = {};

      for (const dep of deps) {
        const id = dep.project ? dep.project.name : dep.name;
        if (!projects[id]) {
          if (dep.project) {
            projects[id] = pick(dep.project, [
              'name',
              'logo',
              'opencollective',
              'github',
            ]);
            projects[id].project = true;
          } else {
            projects[id] = pick(dep, ['name']);
          }
          projects[id]['repos'] = [];
        }
        dep.repos.forEach((repo) => (projects[id]['repos'][repo.id] = repo));
      }

      // Convert objects with ids as key to arrays
      return Object.values(projects).map((project) => {
        project.repos = Object.values(project.repos);
        return project;
      });
    })
    .then((projects) => {
      return projects.sort((a, b) => {
        if (!!a.opencollective !== !!b.opencollective) {
          return a.opencollective ? -1 : 1;
        } else if (a.repos.length !== b.repos.length) {
          return b.repos.length - a.repos.length;
        } else {
          return a.name.localeCompare(b.name);
        }
      });
    })

    .then((recommendations) => recommendations.filter((r) => r.project));
}

export function getDependenciesAvailableForBacking(recommendations) {
  const backing = recommendations
    .filter((r) => r.opencollective)
    .filter((r) => r.opencollective.pledge !== true)
    .map((recommendation) => {
      const { opencollective, github } = recommendation;
      return {
        weight: 100,
        opencollective: pick(opencollective, ['id', 'name', 'slug']),
        github: github,
      };
    });
  return backing;
}

export function parseToBoolean(value) {
  let lowerValue = value;
  // check whether it's string
  if (
    lowerValue &&
    (typeof lowerValue === 'string' || lowerValue instanceof String)
  ) {
    lowerValue = lowerValue.trim().toLowerCase();
  }
  if (['on', 'enabled', '1', 'true', 'yes', 1].includes(lowerValue)) {
    return true;
  }
  return false;
}
