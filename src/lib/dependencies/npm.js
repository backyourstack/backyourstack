const patterns = ['package.json'];

function dependencyObject (packageJson) {
  return {
    core: packageJson.dependencies,
    peer: packageJson.peerDependencies,
    dev: packageJson.devDependencies,
    engines: packageJson.engines,
  };
}

function json (file) {
  return file.json = file.json || JSON.parse(file.text);
}

function dependencies (file) {
  return dependencyObject(json(file));
}

function detectProjectName (file) {
  return json(file).name;
}

export {
  patterns,
  dependencies,
  detectProjectName,
};
