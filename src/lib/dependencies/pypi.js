const patterns = ['requirements.txt'];

const searchAllRepo = false;

function dependencies(file) {
  /**
   * TODO:
   * [ ] handle lines ending in \ by appending the subsequent line
   * [ ] handle lines starting with -
   * [ ] handle remote requirements
   * cf. https://pip.pypa.io/en/stable/reference/pip_install/
   * cf. https://www.python.org/dev/peps/pep-0508/
   */
  const returnObject = { core: [] };
  file.text.split('\n').forEach(line => {
    /**
     * trim off leading and trailing whitespace
     * and lowercase the requirement to avoid duplication
     */
    line = line.trim().toLowerCase();
    /**
     * skip all lines that are comments
     */
    if (line === '') return;
    /**
     * skip all lines that are comments
     */
    if (line.startsWith('#')) return;
    /**
     * skip all lines that start with -
     */
    if (line.startsWith('git+')) return;
    /**
     * skip all lines that start with -
     */
    if (line.startsWith('-')) return;
    /**
     * If none of the above are true:
     * pass the line to the parse function and push the result
     */
    returnObject.core.push(parse(line));
  });
  return returnObject;
}

function detectProjectName() {
  return null;
}

function parse(line) {
  return line.replace(/[^a-zA-Z0-9._-].*$/, '');
}

export { patterns, searchAllRepo, dependencies, detectProjectName };
