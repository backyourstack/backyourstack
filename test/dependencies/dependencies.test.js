import * as dependencies from '../../src/lib/dependencies';
import * as github from '../../src/lib/github';

import { bundlerFile, composerFile, depFile, nugetCsprojFile, npmFile } from '../files';

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
  bundler: [
    { core: 1, name: 'minitest', type: 'bundler' },
    { core: 1, name: 'simplecov', type: 'bundler' },
    { peer: 1, name: 'json', type: 'bundler' },
    { peer: 1, name: 'docile', type: 'bundler' },
    { peer: 1, name: 'simplecov-html', type: 'bundler' },
  ],
};

describe('dependencies', () => {
  describe.each([
    ['bundler', bundlerFile, 'Ruby', 'Gemfile.lock', null],
    ['composer', composerFile, 'PHP', 'composer.json', 'test/sample-composer-project'],
    ['dep', depFile, 'Go', 'Gopkg.lock', null],
    ['npm', npmFile, 'JavaScript', 'package.json', 'sample-npm-project'],
    ['nuget', nugetCsprojFile, 'C#', '*.csproj', 'sample-nuget-project'],
  ])('for %s file', (type, file, language, pattern, projectName) => {
    test('should detect file type', () => {
      expect(dependencies.detectDependencyFileType(file)).toBe(file);
      expect(file.type).toBe(type);
      expect(file.matchedPattern).toBe(pattern);
    });

    test('should detect project name', () => {
      expect(dependencies.detectProjectName(file)).toBe(projectName);
    });

    test('should return dependency stats', () => {
      const result = dependencies.dependenciesStats(file);
      const expected = expectedDependencies[type];
      expect(result).toHaveLength(expected.length);
      expected.forEach(expectedDependency => expect(result).toContainEqual(expectedDependency));
    });

    describe('using github', () => {
      let spyFetch, spySearch;
      beforeEach( () => {
        spyFetch = jest.spyOn(github, 'fetchFileFromRepo')
          .mockImplementation( () => Promise.resolve(file.text) );
        spySearch = jest.spyOn(github, 'searchFilesFromRepo')
          .mockImplementation( () => Promise.resolve([file.text]) );
      });
      afterEach( () => {
        spyFetch.mockRestore();
        spySearch.mockRestore();
      });

      test('should get the stats from a Github repo', () => {
        const repo = { language };
        const expected = expectedDependencies[type];
        return dependencies.getDependenciesFromGithubRepo(repo, 'token').then( result => {
          expected.forEach(expectedDependency => expect(result).toContainEqual(expectedDependency));
          expect(result).toHaveLength(expected.length);
        });
      });
    });
  });

  describe('for an unrelated file', () => {
    const file = {
      name: 'dummy.txt',
      text: 'Hello, world',
    };

    test('should not detect file type', () => {
      expect(dependencies.detectDependencyFileType(file)).toBeFalsy();
    });

    test('should not detect project name', () => {
      expect(dependencies.detectProjectName(file)).toBe(undefined);
    });

    test('should return empty dependency stats', () => {
      expect(dependencies.dependenciesStats(file)).toEqual([]);
    });
  });


});
