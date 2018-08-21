import * as nuget from '../../src/lib/dependencies/nuget';

import { nugetCsprojFile, npmFile } from '../files';

describe('nuget dependencies', () => {

  test('should detect npm file type', () => {
    const result = nuget.isDependencyFile(nugetCsprojFile);
    expect(result).toBeTruthy();
  });

  test('should not detect other file type', () => {
    const result = nuget.isDependencyFile(npmFile);
    expect(result).toBeFalsy();
  });

  test('should detect project name', () => {
    const projectName = nuget.detectProjectName(nugetCsprojFile);
    expect(projectName).toBe('Apogee');
  });

  test('should detect dependencies', () => {
    const dependencies = nuget.dependenciesStats(nugetCsprojFile);

    expect(dependencies).toHaveLength(4);
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'Microsoft.AspNetCore.Http.Abstractions', 'type': 'nuget' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'Microsoft.AspNetCore.Hosting.Abstractions', 'type': 'nuget' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'Microsoft.Extensions.Logging.Abstractions', 'type': 'nuget' });
    expect(dependencies).toContainEqual({ 'core': 1, 'name': 'Microsoft.Extensions.Options', 'type': 'nuget' });
  });

});
