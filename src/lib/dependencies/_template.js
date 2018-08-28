// This is a template to add support for new package managers.

const patterns = ['...']; // Patterns of filenames used by the package manager.
                          // Supports '*' only at the beginning or end of a pattern.

const searchAllRepo = false; // Flag for package managers with files not typically at the root level

/**
 * Computes the list of dependencies for the given file.
 * @param {object} file - Keys: text, matchedPattern, ...
 * @returns {object} list of dependencies, grouped by type,
 *   where keys are any of {core|dev|peer|engines} and
 *   values are [dependencyName, ...]
 */
function dependencies (/* file */) {
  return { core: [] };
}

/**
 * Computes the project name for the given file.
 * @param {object} file - Keys: text, matchedPattern, ...
 * @returns {String|null}
 */
function detectProjectName (/* file */) {
  return null;
}

export {
  patterns,
  searchAllRepo,
  dependencies,
  detectProjectName,
};
