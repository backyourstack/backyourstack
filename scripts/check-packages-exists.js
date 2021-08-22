import fetch from 'cross-fetch';
import { remove } from 'lodash';

import logger from '../src/logger';

import { getProjects, saveProjects } from '../data';

(async () => {
  const projects = await getProjects();

  for (const project of projects) {
    for (const pkg of project.packages) {
      if (pkg.type === 'npm') {
        logger.info(`Checking npm ${pkg.name}`);
        const npmExists = await fetch(`https://registry.npmjs.org/${pkg.name}`)
          .then((res) => (res.status === 200 ? true : false))
          .catch(() => false);
        if (!npmExists) {
          logger.info(`- ${pkg.name} is not registered on npm. Deleting.`);
          remove(
            project.packages,
            (p) => p.type === pkg.type && p.name === pkg.name,
          );
        }
      }
      if (pkg.type === 'composer') {
        logger.info(`Checking composer ${pkg.name}`);
        const packagistExists = await fetch(
          `https://repo.packagist.org/p/${pkg.name}.json`,
        )
          .then((res) => (res.status === 200 ? true : false))
          .catch(() => false);
        if (!packagistExists) {
          logger.info(
            `- ${pkg.name} is not registered on packagist. Deleting.`,
          );
          remove(
            project.packages,
            (p) => p.type === pkg.type && p.name === pkg.name,
          );
        }
      }
      if (pkg.type === 'gem') {
        logger.info(`Checking gem ${pkg.name}`);
        const gemExists = await fetch(
          `https://rubygems.org/api/v1/gems/${pkg.name}.json`,
        )
          .then((res) => (res.status === 200 ? true : false))
          .catch(() => false);
        if (!gemExists) {
          logger.info(`- ${pkg.name} is not registered on rubygems. Deleting.`);
          remove(
            project.packages,
            (p) => p.type === pkg.type && p.name === pkg.name,
          );
        }
      }
      if (pkg.type === 'pypi') {
        logger.info(`Checking pypi ${pkg.name}`);
        const pypiExists = await fetch(`https://pypi.org/pypi/${pkg.name}/json`)
          .then((res) => (res.status === 200 ? true : false))
          .catch(() => false);
        if (!pypiExists) {
          logger.info(`- ${pkg.name} is not registered on pypi. Deleting.`);
          remove(
            project.packages,
            (p) => p.type === pkg.type && p.name === pkg.name,
          );
        }
      }
    }
  }

  await saveProjects(projects);
})();
