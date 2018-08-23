import { fetchFileFromRepo } from '../github';
const patterns = ['package.json'];

const dependencyTypes = {
  core: 'dependencies',
  peer: 'peerDependencies',
  dev: 'devDependencies',
  engines: 'engines',
};

function dependenciesStats (packageJson) {
  const dependencies = {};
  Object.entries(dependencyTypes).forEach(([ dependencyType, dependencyKey ]) => {
    if (packageJson[dependencyKey]) {
      Object.keys(packageJson[dependencyKey]).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'npm', name };
        dependencies[name][dependencyType] = 1;
      });
    }
  });
  return Object.values(dependencies);
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  return fetchFileFromRepo(githubRepo, 'package.json', githubAccessToken)
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
