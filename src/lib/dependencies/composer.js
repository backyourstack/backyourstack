const patterns = ['composer.json'];

function dependencyObject (composerJson) {
  return {
    core: composerJson.require,
    dev: composerJson['require-dev'],
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
