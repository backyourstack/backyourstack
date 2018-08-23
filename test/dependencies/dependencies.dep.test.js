import * as dep from '../../src/lib/dependencies/dep';

import { depFile, npmFile } from '../files';

describe('dep dependencies', () => {

  test('should detect dep file type', () => {
    const result = dep.isDependencyFile(depFile);
    expect(result).toBeTruthy();
  });

  test('should not detect other file type', () => {
    const result = dep.isDependencyFile(npmFile);
    expect(result).toBeFalsy();
  });

  test('should detect project name', () => {
    const projectName = dep.detectProjectName(depFile);
    expect(projectName).toBe(null);
  });

  test('should detect dependencies', () => {
    const dependencies = dep.dependenciesStats(depFile.text);

    expect(dependencies).toHaveLength(2);
    expect(dependencies).toContainEqual({ 'name': 'github.com/goreleaser/nfpm', 'type': 'dep', 'core': 1 });
    expect(dependencies).toContainEqual({ 'name': 'github.com/alecthomas/kingpin', 'type': 'dep', 'core': 1 });
  });

});
