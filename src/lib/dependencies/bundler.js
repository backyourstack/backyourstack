import { interpret } from 'gemfile';
import { difference } from 'lodash';

const patterns = ['Gemfile.lock'];

function dependencies(file) {
  const gemfile = interpret(file.text);
  const core = Object.keys(gemfile['DEPENDENCIES'] || {});
  const peer = difference(Object.keys(gemfile['GEM'].specs || {}), core);
  return { core, peer };
}

function detectProjectName() {
  return null;
}

export { patterns, dependencies, detectProjectName };
