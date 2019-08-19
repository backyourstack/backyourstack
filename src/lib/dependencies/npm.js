const patterns = ['package.json'];

function dependencyObject(packageJson) {
  return {
    core: Object.keys(packageJson.dependencies || {}),
    peer: Object.keys(packageJson.peerDependencies || {}),
    dev: Object.keys(packageJson.devDependencies || {}),
    engines: Object.keys(packageJson.engines || {}),
  };
}

function json(file) {
  return (file.json = file.json || JSON.parse(file.text));
}

function dependencies(file) {
  return {
    dependencies: dependencyObject(json(file)),
    fileUrl: file.fileUrl || null,
  };
}

function detectProjectName(file) {
  return json(file).name;
}

export { patterns, dependencies, detectProjectName };
