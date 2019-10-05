const patterns = ['requirements.txt'];

const searchAllRepo = false;

/**
 * Computes the list of dependencies for the given file.
 * @param {object} file - Keys: text, matchedPattern, ...
 * @returns {object} list of dependencies, grouped by type,
 *   where keys are any of {core|dev|peer|engines} and
 *   values are [dependencyName, ...]
 */
function dependencies(/* file */) {
  return { core: [] };
}

function detectProjectName() {
  return null;
}

export { patterns, searchAllRepo, dependencies, detectProjectName };
