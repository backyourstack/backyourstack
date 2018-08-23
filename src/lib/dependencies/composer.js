import { fetchFileFromRepo } from '../github';
const patterns = ['composer.json'];

const dependencyTypes = {
  core: 'require',
  dev: 'require-dev',
};

function dependenciesStats (composerJson) {
  const dependencies = {};
  Object.entries(dependencyTypes).forEach(([ dependencyType, dependencyKey ]) => {
    if (composerJson[dependencyKey]) {
      Object.keys(composerJson[dependencyKey]).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'composer', name };
        dependencies[name][dependencyType] = 1;
      });
    }
  });
  return Object.values(dependencies);
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  return fetchFileFromRepo(githubRepo, 'composer.json', githubAccessToken)
    .then(JSON.parse)
    .then(dependenciesStats);
}

function detectProjectName (file) {
  return file.json && file.json.name;
}

export {
  patterns,
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectProjectName,
};
