import fs from 'fs';
import path from 'path';

function getFile(filename) {
  const file = {
    name: path.basename(filename),
    text: fs.readFileSync(filename, 'utf8'),
  };

  return file;
}

const npmFilename = path.join(__dirname, 'samples', 'package.json');

export const npmFile = getFile(npmFilename);

const composerFilename = path.join(__dirname, 'samples', 'composer.json');

export const composerFile = getFile(composerFilename);

const nugetCsprojFilename = path.join(
  __dirname,
  'samples',
  'sample-nuget-project.csproj',
);

export const nugetCsprojFile = getFile(nugetCsprojFilename);

const depFilename = path.join(__dirname, 'samples', 'Gopkg.lock');

export const depFile = getFile(depFilename);

const bundlerFilename = path.join(__dirname, 'samples', 'Gemfile.lock');

export const bundlerFile = getFile(bundlerFilename);
