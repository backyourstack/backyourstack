import toml from 'toml';

const patterns = ['Gopkg.lock'];

function dependencies (file) {
  const data = toml.parse(file.text);
  return { core: data.projects.map(proj => proj.name) };
}

function detectProjectName () {
  return null;
}

export {
  patterns,
  dependencies,
  detectProjectName,
};
