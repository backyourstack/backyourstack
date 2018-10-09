import toml from 'toml';

const patterns = ['Gopkg.lock', 'Gopkg.toml'];

const handlers = {
  'Gopkg.lock': gopkgLockDependencies,
  'Gopkg.toml': gopkgTomlDependencies,
};

function gopkgLockDependencies(data) {
  return data.projects.map(proj => proj.name);
}

function gopkgTomlDependencies(data) {
  return data.constraint.map(proj => proj.name);
}

function dependencies(file) {
  const data = toml.parse(file.text);
  return { core: handlers[file.matchedPattern](data) };
}

function detectProjectName() {
  return null;
}

export { patterns, dependencies, detectProjectName };
