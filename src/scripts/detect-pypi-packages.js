import '../env';
import logger from '../logger';

import { uniq, pick, get } from 'lodash';

import { fetchWithOctokit, fetchFileFromRepo, getContent, silentError } from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexps = [
  /https:\/\/pypi\.org\/project\/([a-z0-9-._]*)/gi,
  /https:\/\/img\.shields\.io\/pypi\/[^/]+\/([a-z0-9-._]*).svg/gi,
  /https:\/\/badge\.fury\.io\/py\/([a-z0-9-._]*).svg/gi,
];

(async () => {

  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];

    for (const repo of collective.repos) {
      if (repo.languages.indexOf('Python') !== -1) {

        // 1. Detect packagist links in Readme
        const readme = await fetchWithOctokit(
          'repos.getReadme', { owner: repo.owner.login, repo: repo.name }
        ).then(getContent).catch(silentError);
        if (readme) {
          let result;
          do {
            for (const regexp of regexps) {
              result = regexp.exec(readme);
              if (result) {
                const packageId = result[1];
                packageIds.push(packageId);
              }
            }
          } while (result);
        }

        // 2. Detect project name in setup.py
        const gemspecFilename = repo.files.find(filename => filename.endsWith('setup.py'));
        if (gemspecFilename) {
          const gemspecFile = await fetchFileFromRepo(
            repo, gemspecFilename
          ).catch(silentError);
          if (gemspecFile) {
            const regexp = /name=["']([a-z0-9_.-]*)["']/gi;
            const result = regexp.exec(gemspecFile);
            if (result) {
              const packageId = result[1];
              packageIds.push(packageId);
            }
          }
        }

      }
    }

    packageIds = uniq(packageIds).filter(packageId => !!packageId);

    if (packageIds.length) {
      logger.info(`Collective: ${collective.slug} ${collective.name}`, { packageIds });
      let project = projects.find(p => get(p, 'opencollective.id') === collective.id);
      if (!project) {
        project = {
          name: collective.slug,
          packages: [],
          github: collective.github,
          opencollective: pick(collective, ['id', 'name', 'slug', 'description']),
        };
        projects.push(project);
      }
      for (const packageId of packageIds) {
        const pkg = {
          'type': 'pypi',
          'name': packageId,
        };
        const pkgRegistered = project.packages.find(p => p.type === pkg.type && p.name === pkg.name);
        if (!pkgRegistered) {
          const pypiExists = await fetch(`https://pypi.org/pypi/${packageId}/json`)
            .then(res => res.status === 200 ? true : false)
            .catch(() => false);
          if (!pypiExists) {
            logger.info(`- ${packageId} is not registered on pypi. Ignoring.`);
            continue;
          }
          project.packages.push(pkg);
        }
      }
    }

  }

  await saveProjects(projects);

})();
