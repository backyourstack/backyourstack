import { pick } from 'lodash';

import allProjects from '../data/projects.json';

const dependencyTypes = ['core', 'peer', 'dev', 'engines'];

function getProjectFromDependency(name, type) {
  return allProjects.find(project =>
    project.packages.find(
      pkg => pkg.name.toLowerCase() === name.toLowerCase() && pkg.type === type,
    ),
  );
}

function getAllDependenciesFromRepos(repos) {
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
  return Object.values(dependencies).map(dependency => {
    dependency.repos = Object.values(dependency.repos);
    return dependency;
  });
}

function addProjectToDependencies(deps) {
  return Promise.all(deps.map(dep => addProjectToDependency(dep)));
}

function addProjectToDependency(dep) {
  const project = getProjectFromDependency(dep.name, dep.type);
  if (project) {
    dep.project = project;
  }
  return dep;
}

function getRecommendedProjectFromDependencies(deps) {
  return addProjectToDependencies(deps)
    .then(deps => {
      const projects = {};

      for (const dep of deps) {
        const id = dep.project ? dep.project.name : dep.name;
        if (!projects[id]) {
          projects[id] = dep.project
            ? pick(dep.project, ['name', 'logo', 'opencollective'])
            : pick(dep, ['name']);
          projects[id]['repos'] = [];
        }
        dep.repos.forEach(repo => (projects[id]['repos'][repo.id] = repo));
      }

      // Convert objects with ids as key to arrays
      return Object.values(projects).map(project => {
        project.repos = Object.values(project.repos);
        return project;
      });
    })
    .then(projects => {
      return projects.sort(
        (a, b) =>
          a.repos.length != b.repos.length
            ? b.repos.length - a.repos.length
            : a.name.localeCompare(b.name),
      );
    })
    .then(recommendations => recommendations.filter(r => r.opencollective));
}

export {
  addProjectToDependencies,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
};
