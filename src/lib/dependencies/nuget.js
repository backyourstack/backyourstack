import xmldoc from 'xmldoc';


import { flatten } from 'lodash';

const searchAllRepo = true;
const patterns = ['*.csproj', 'packages.config'];

const handlers = {
  'packages.config': packagesConfigDependencies,
  '*.csproj': csprojDependencies,
};

function csprojDependencies (csproj) {
  const packageReferences = csproj.childrenNamed('ItemGroup').map(itemGroup => itemGroup.childrenNamed('PackageReference'));
  return flatten(packageReferences).map(packageReference => packageReference.attr.Include);
}

function packagesConfigDependencies (packagesConfig) {
  return packagesConfig.childrenNamed('package').map(element => element.attr.id).filter(name => !!name);
}

function dependencies (file) {
  const xml = new xmldoc.XmlDocument(file.text);
  return { core: handlers[file.matchedPattern](xml) };
}

function detectProjectName (file) {
  if (file.name.indexOf('.csproj') !== -1) {
    return file.name.replace('.csproj', '');
  }
}

export {
  patterns,
  searchAllRepo,
  dependencies,
  detectProjectName,
};
