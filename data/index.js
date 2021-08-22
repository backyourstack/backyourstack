import path from 'path';

import fs from 'fs-extra';

export function getCollectives() {
  return fs.readJson(path.join(__dirname, 'collectives.json'));
}

export function saveCollectives(collectives) {
  return fs.writeFile(
    path.join(__dirname, 'collectives.json'),
    JSON.stringify(
      collectives.sort((a, b) => a.id - b.id),
      null,
      2,
    ),
  );
}

export function getProjects() {
  return fs.readJson(path.join(__dirname, 'projects.json'));
}

export function saveProjects(projects) {
  return fs.writeFile(
    path.join(__dirname, 'projects.json'),
    JSON.stringify(
      projects.sort((a, b) => a.name.localeCompare(b.name)),
      null,
      2,
    ),
  );
}
