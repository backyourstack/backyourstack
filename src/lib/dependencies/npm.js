const patterns = ['package.json'];

function dependencyObject (packageJson) {
  return {
    core: packageJson.dependencies,
    peer: packageJson.peerDependencies,
    dev: packageJson.devDependencies,
    engines: packageJson.engines,
  };
}

function dependencies (file) {
  return dependencyObject(JSON.parse(file.text));
}

function detectProjectName (file) {
  return file.json && file.json.name;
}

export {
  patterns,
  dependencies,
  detectProjectName,
};
