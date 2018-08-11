import debug from 'debug';

import cache from '../cache';

import xmldoc from 'xmldoc';

import { searchFilesFromRepo } from '../github';

import { flatten } from 'lodash';

const _debug = debug('dependencies:nuget');

function csprojDependenciesStats (csproj) {
    const dependencies = {};
    const packageReferences = csproj.childrenNamed('ItemGroup').map(itemGroup => itemGroup.childrenNamed('PackageReference'));
    flatten(packageReferences).map(packageReference => packageReference.attr.Include).forEach(name => {
        dependencies[name] = dependencies[name] || { type: 'nuget', name, core: 1 }
    });
    return Object.values(dependencies);
}

function packagesConfigDependenciesStats (packagesConfig) {
  const dependencies = {};
  packagesConfig.childrenNamed('package').map(element => element.attr.id).filter(name => !!name).forEach(name => {
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
    
    function mapPackages(searchPattern, transform) {
      return searchFilesFromRepo(githubRepo, searchPattern, githubAccessToken)
        .then(files => files.map(xml => new xmldoc.XmlDocument(xml))
          .map(transform)
          .reduce(aggregateDependencies)
        )
        .catch(err => {
          _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
          return [];
        });
    }

    return Promise.all(
        mapPackages('*.csproj', csprojDependenciesStats),
        mapPackages('packages.config', packagesConfigDependenciesStats)
      )
      .then(result => flatten(result))
      .then(result => {
        cache.set(cacheKey, result);
        return result;
      });
  }
  
  export {
    getDependenciesFromGithubRepo,
    csprojDependenciesStats,
  };