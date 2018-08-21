import fs from 'fs';
import path from 'path';

function getFile (filename) {
  const file = {
    name: path.basename(filename),
    text: fs.readFileSync(filename, 'utf8'),
  };

  try {
    file.json = JSON.parse(file.text);
  } catch (e) {
    // Invalid JSON
  }

  return file;
}

const npmFilename = path.join(path.dirname(__dirname), 'files', 'package.json');

export const npmFile = getFile(npmFilename);

const composerFilename = path.join(path.dirname(__dirname), 'files', 'composer.json');

export const composerFile = getFile(composerFilename);

const nugetCsprojFilename = path.join(path.dirname(__dirname), 'files', 'Apogee.csproj');

export const nugetCsprojFile = getFile(nugetCsprojFilename);
