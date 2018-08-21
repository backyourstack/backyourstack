import * as npm from '../../src/lib/dependencies/npm';

import { composerFile, npmFile } from '../files';

describe('npm dependencies', () => {

  test('should detect npm file type', () => {
    const result = npm.isDependencyFile(npmFile);
    expect(result).toBeTruthy();
  });

  test('should not detect other file type', () => {
    const result = npm.isDependencyFile(composerFile);
    expect(result).toBeFalsy();
  });

  test('should detect project name', () => {
    const projectName = npm.detectProjectName(npmFile);
    expect(projectName).toBe('sample-npm-project');
  });

  test('should detect dependencies', () => {
    const dependencies = npm.dependenciesStats(npmFile.json);

    expect(dependencies).toHaveLength(6);
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'next', 'type': 'npm' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'react', 'type': 'npm' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'react-dom', 'type': 'npm' });
    expect(dependencies).toContainEqual({ 'dev': 1, 'name': 'eslint', 'type': 'npm' });
    expect(dependencies).toContainEqual({ 'dev': 1, 'name': 'jest', 'type': 'npm' });
    expect(dependencies).toContainEqual({ 'engines': 1, 'name': 'node', 'type': 'npm' });
  });

});
