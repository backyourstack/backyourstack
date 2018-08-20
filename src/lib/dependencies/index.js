import * as composer from './composer';
import * as npm from './npm';
import * as nuget from './nuget';
import * as dep from './dep';

const dependencyManagers = {
  npm,
  composer,
  nuget,
  dep,
};

const languageToFileType = {
  JavaScript: 'npm',
  TypeScript: 'npm',
  PHP: 'composer',
  'C#': 'nuget',
  'Go': 'dep',
};

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const fileType = languageToFileType[githubRepo.language];
  if (!fileType) {
    return Promise.resolve([]);
  }
  return dependencyManagers[fileType].getDependenciesFromGithubRepo(githubRepo, githubAccessToken);
}

function dependenciesStats (file) {
  if (file.type === 'npm') {
    return npm.dependenciesStats(file.json);
  }
  if (file.type === 'composer') {
    return composer.dependenciesStats(file.json);
  }
  if (file.type === 'nuget') {
    return nuget.dependenciesStats(file);
  }
  if (file.type === 'dep') {
    return dep.dependenciesStats(file.text);
  }
  return [];
}

function detectDependencyFileType (file) {
  if (npm.isDependencyFile(file)) {
    return 'npm';
  }
  if (composer.isDependencyFile(file)) {
    return 'composer';
  }
  if (nuget.isDependencyFile(file)) {
    return 'nuget';
  }
  if (dep.isDependencyFile(file)) {
    return 'dep';
  }
}

function detectProjectName (file) {
  if (file.type === 'npm') {
    return npm.detectProjectName(file);
  }
  if (file.type === 'composer') {
    return composer.detectProjectName(file);
  }
  if (file.type === 'nuget') {
    return nuget.detectProjectName(file);
  }
  if (file.type === 'dep') {
    return dep.detectProjectName(file);
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  detectDependencyFileType,
  detectProjectName,
};
