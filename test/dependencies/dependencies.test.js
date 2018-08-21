import * as dependencies from '../../src/lib/dependencies';

import { composerFile, depFile, nugetCsprojFile, npmFile } from '../files';

const expectedDependencies = {
  composer: [
    { core: 1, name: 'php', type: 'composer' },
    { core: 1, name: 'monolog/monolog', type: 'composer' },
    { core: 1, name: 'symfony/http-foundation', type: 'composer' },
  ],
  dep: [
    { core: 1, name: 'github.com/goreleaser/nfpm', type: 'dep' },
    { core: 1, name: 'github.com/alecthomas/kingpin', type: 'dep' },
  ],
  npm: [
    { core: 1, name: 'next', type: 'npm' },
    { core: 1, name: 'react', type: 'npm' },
    { core: 1, name: 'react-dom', type: 'npm' },
    { dev: 1, name: 'eslint', type: 'npm' },
    { dev: 1, name: 'jest', type: 'npm' },
    { engines: 1, name: 'node', type: 'npm' },
  ],
  nuget: [
    { core: 1, name: 'Microsoft.AspNetCore.Http.Abstractions', type: 'nuget' },
    { core: 1, name: 'Microsoft.AspNetCore.Hosting.Abstractions', type: 'nuget' },
    { core: 1, name: 'Microsoft.Extensions.Logging.Abstractions', type: 'nuget' },
    { core: 1, name: 'Microsoft.Extensions.Options', type: 'nuget' },
  ],
};

describe('dependencies', () => {
  describe.each([
    ['composer', composerFile],
    ['dep', depFile],
    ['npm', npmFile],
    ['nuget', nugetCsprojFile],
  ])('for %s file', (type, file) => {
    test('should detect file type', () => {
      expect(dependencies.detectDependencyFileType(file)).toBe(type);
    });

    test('should detect project name', () => {
      file.type = type;
      const expected = type === 'dep' ? null : `sample-${type}-project`;
      expect(dependencies.detectProjectName(file)).toBe(expected);
    });

    test('should return dependency stats', () => {
      file.type = type;
      const result = dependencies.dependenciesStats(file);
      const expected = expectedDependencies[type];
      expect(result).toHaveLength(expected.length);
      expected.forEach(expectedDependency => expect(result).toContainEqual(expectedDependency));
    });
  });
});
