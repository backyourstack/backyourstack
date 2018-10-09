import minimatch from 'minimatch';

import dependencyManagers from './dependency-managers';

// Assumes dependencyObject is {core: ['dependency', ...], ...}
// Returns [{type: 'npm', name: 'dependency', core: 1}, ...]
export function transformToStats(manager, ...dependencyObjects) {
  const index = {};
  dependencyObjects.forEach(dependencies => {
    Object.entries(dependencies).forEach(
      ([dependencyType, dependencyNames]) => {
        dependencyNames.forEach(name => {
          index[name] = index[name] || { type: manager, name };
          index[name][dependencyType] = 1;
        });
      },
    );
  });
  return Object.values(index);
}

export function dependenciesStats(file) {
  const manager = findManager(file);
  if (manager) {
    return transformToStats(file.type, manager.dependencies(file));
  }
  return [];
}

// Returns `file` or undefined if file is not a recognized dependency file.
export function detectDependencyFileType(file) {
  for (const type in dependencyManagers) {
    for (const matchedPattern of dependencyManagers[type].patterns) {
      if (minimatch(file.name, matchedPattern)) {
        return Object.assign(file, { type, matchedPattern });
      }
    }
  }
}

export function detectProjectName(file) {
  const manager = findManager(file);
  if (manager) {
    return manager.detectProjectName(file);
  }
}

export function findManager(file) {
  if (!file.type) {
    detectDependencyFileType(file);
  }
  return dependencyManagers[file.type];
}
