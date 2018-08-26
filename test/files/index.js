import fs from 'fs';
import path from 'path';

function getFile (filename) {
  const file = {
    name: path.basename(filename),
    text: fs.readFileSync(filename, 'utf8'),
  };

  return file;
}

const npmFilename = path.join(path.dirname(__dirname), 'files', 'package.json');

export const npmFile = getFile(npmFilename);

const composerFilename = path.join(path.dirname(__dirname), 'files', 'composer.json');

export const composerFile = getFile(composerFilename);

const nugetCsprojFilename = path.join(path.dirname(__dirname), 'files', 'sample-nuget-project.csproj');

export const nugetCsprojFile = getFile(nugetCsprojFilename);

const depFilename = path.join(path.dirname(__dirname), 'files', 'Gopkg.lock');

export const depFile = getFile(depFilename);
