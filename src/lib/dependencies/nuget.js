import debug from 'debug';

import cache from '../cache';

import xmldoc from 'xmldoc';

import { searchFilesFromRepo } from '../github';

import { flatten, head } from 'lodash';

const _debug = debug('dependencies:nuget');

function csprojDependenciesStats (csproj) {
  const dependencies = {};
  const packageReferences = csproj.childrenNamed('ItemGroup').map(itemGroup => itemGroup.childrenNamed('PackageReference'));
  flatten(packageReferences).map(packageReference => packageReference.attr.Include).forEach(name => {
    dependencies[name] = dependencies[name] || { type: 'nuget', name, core: 1 };
  });
  return Object.values(dependencies);
}

function packagesConfigDependenciesStats (packagesConfig) {
  const dependencies = {};
  packagesConfig.childrenNamed('package').map(element => element.attr.id).filter(name => !!name).forEach(name => {
    dependencies[name] = dependencies[name] || { type: 'nuget', name, core: 1 };
  });
  return Object.values(dependencies);
}

function aggregateDependencies (a, b) {
  return a.concat(b.filter(x => a.indexOf(x) == -1));
}

function getDependenciesFromGithubRepo (githubRepo, githubAccessToken) {
  const cacheKey = `repo_nuget_dependencies_${githubRepo.id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  function mapPackages (searchPattern, transform) {
    return searchFilesFromRepo(githubRepo, searchPattern, githubAccessToken)
      .then(files => files.map(xml => new xmldoc.XmlDocument(xml))
        .map(transform)
      )
      .then(deps => deps && deps.length ? deps.reduce(aggregateDependencies) : [])
      .catch(err => {
        _debug(`getDependenciesFromGithubRepo error: ${err.message}`);
        return [];
      });
  }

  // Modern C# projects define dependencies in the *.csproj files, however this is
  // relatively new starting when .NET Core was released. Fall back to the legacy
  // packages.config if no dependencies were found in *.csproj.
  function evalForFallbackToPackagesConfig (result) {
    return result && result.length
      ? result
      : mapPackages('packages.config', packagesConfigDependenciesStats);
  }

  return mapPackages('*.csproj', csprojDependenciesStats)
    .then(evalForFallbackToPackagesConfig)
    .then(result => {
      cache.set(cacheKey, result);
      return result;
    });
}

function dependenciesStats (file) {
  if (file.name === 'packages.config') {
    const xml = new xmldoc.XmlDocument(file.text);
    return packagesConfigDependenciesStats(xml);
  }
  if (file.name.indexOf('.csproj') !== -1) {
    const xml = new xmldoc.XmlDocument(file.text);
    return csprojDependenciesStats(xml);
  }
  return [];
}

function isDependencyFile (file) {
  if (file.name === 'packages.config' || file.name.indexOf('.csproj') !== -1) {
    return true;
  }
}

function detectProjectName (file) {
  if (file.name.indexOf('.csproj') !== -1) {
    const xml = new xmldoc.XmlDocument(file.text);
    const searchPackageId = xml.childrenNamed('PropertyGroup').map(itemGroup => itemGroup.childrenNamed('PackageId'));
    const packageId = head(flatten(searchPackageId));
    if (packageId) {
      return packageId.val;
    }
  }
}

export {
  getDependenciesFromGithubRepo,
  dependenciesStats,
  isDependencyFile,
  detectProjectName,
};
