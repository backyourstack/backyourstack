import debug from 'debug';

import cache from '../cache';

import xmldoc from 'xmldoc';

import { searchFilesFromRepo } from '../github';

const _debug = debug('dependencies:nuget');

function csprojDependenciesStats (csproj) {
    const dependencies = {};
    csproj.childrenNamed('ItemGroup').map(itemGroup => itemGroup.childrenNamed('PackageReference')).reduce((a, b) => a.concat(b)).map(packageReference => packageReference.attr.Include).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'nuget', name, core: 1 }
    });
    return Object.values(dependencies);
}

function aggregateDependencies(a, b) {
    return a.concat(b.filter(x => a.indexOf(x) == -1));
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
    const cacheKey = `repo_nuget_dependencies_${githubRepo.id}`;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }
    return searchFilesFromRepo(githubRepo, '*.csproj', githubAccessToken)
      .then(files => files.map(xml => new xmldoc.XmlDocument(xml))
        .map(csprojDependenciesStats)
        .reduce(aggregateDependencies)
      )
      .catch(err => {
        _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
        return [];
      })
      .then(result => {
        cache.set(cacheKey, result);
        return result;
      });
  }
  
  export {
    getDependenciesFromGithubRepo,
    csprojDependenciesStats,
  };