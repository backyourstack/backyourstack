import * as composer from '../../src/lib/dependencies/composer';

import { composerFile, npmFile } from '../files';

describe('composer dependencies', () => {

  test('should detect npm file type', () => {
    const result = composer.isDependencyFile(composerFile);
    expect(result).toBeTruthy();
  });

  test('should not detect other file type', () => {
    const result = composer.isDependencyFile(npmFile);
    expect(result).toBeFalsy();
  });

  test('should detect project name', () => {
    const projectName = composer.detectProjectName(composerFile);
    expect(projectName).toBe('sample-composer-project');
  });

  test('should detect dependencies', () => {
    const dependencies = composer.dependenciesStats(composerFile.json);

    expect(dependencies).toHaveLength(3);
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'php', 'type': 'composer' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'monolog/monolog', 'type': 'composer' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'symfony/http-foundation', 'type': 'composer' });
  });

});
