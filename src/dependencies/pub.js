import YAML from 'yaml';
import { concat, keys, uniq } from 'lodash';

const patterns = ['pubspec.yaml'];

const searchAllRepo = false;

function dependencies(file) {
  const data = YAML.parse(file.text);
  const core = uniq(
    concat(keys(data.dependencies), keys(data.dev_dependencies)),
  );
  return { core };
}

function detectProjectName(file) {
  const data = YAML.parse(file.text);
  return data.name;
}

export { patterns, searchAllRepo, dependencies, detectProjectName };
