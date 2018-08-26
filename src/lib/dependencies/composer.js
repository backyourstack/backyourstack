const patterns = ['composer.json'];

function dependencyObject (composerJson) {
  return {
    core: composerJson.require,
    dev: composerJson['require-dev'],
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
