import { pick } from 'lodash';

import allProjects from '../data/projects.json';

async function getProjectFromDependency(dependency) {
  return allProjects.find(project =>
    project.packages.find(pkg => pkg.name === dependency)
  );
}

const dependencyTypes = ['dependencies', 'peerDependencies', 'devDependencies'];

async function getAllDependenciesFromRepos(repos) {
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

function addProjectToDependencies(deps) {
  return Promise.all(
    deps.map(
      dep => addProjectToDependency(dep)
    )
  );
}

function addProjectToDependency(dep) {
  return getProjectFromDependency(dep.name)
    .then(project => {
      if (project) {
        dep.project = project;
      }
      return dep;
    });
}

function getRecommendedProjectFromDependencies(deps) {
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
          projects[id].repos = [... projects[id].repos, ... dep.repos];
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
  getAllDependenciesFromRepos,
  addProjectToDependencies,
  getRecommendedProjectFromDependencies
};
