const patterns = ['composer.json'];

function dependencyObject(composerJson) {
  return {
    core: Object.keys(composerJson.require || {}),
    dev: Object.keys(composerJson['require-dev'] || {}),
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
