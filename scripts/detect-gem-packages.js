import '../env';
import logger from '../logger';

import { uniq, pick, get } from 'lodash';

import {
  fetchWithOctokit,
  fetchFileFromRepo,
  getContent,
  silentError,
} from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexps = [
  /https:\/\/rubygems\.org\/gems\/([a-z0-9-._]*)/gi,
  /https:\/\/img\.shields\.io\/gem\/[^/]+\/([a-z0-9-._]*).svg/gi,
];

(async () => {
  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];

    for (const repo of collective.repos) {
      if (repo.languages.indexOf('Ruby') !== -1) {
        // 1. Detect packagist links in Readme
        const readme = await fetchWithOctokit('repos.getReadme', {
          owner: repo.owner.login,
          repo: repo.name,
        })
          .then(getContent)
          .catch(silentError);
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

        // 2. Detect project name in gemspec
        const gemspecFilename = repo.files.find((filename) =>
          filename.endsWith('.gemspec'),
        );
        if (gemspecFilename) {
          const gemspecFile = await fetchFileFromRepo(
            repo,
            gemspecFilename,
          ).catch(silentError);
          if (gemspecFile) {
            const regexp = /\.name\s*=\s*["']([a-z0-9_.-]*)["']/gi;
            const result = regexp.exec(gemspecFile);
            if (result) {
              const packageId = result[1];
              packageIds.push(packageId);
            }
          }
        }
      }
    }

    packageIds = uniq(packageIds).filter((packageId) => !!packageId);

    if (packageIds.length) {
      logger.info(`Collective: ${collective.slug} ${collective.name}`, {
        packageIds,
      });
      let project = projects.find(
        (p) => get(p, 'opencollective.id') === collective.id,
      );
      if (!project) {
        project = {
          name: collective.slug,
          packages: [],
          github: collective.github,
          opencollective: pick(collective, [
            'id',
            'name',
            'slug',
            'description',
            'pledge',
          ]),
        };
        projects.push(project);
      }
      for (const packageId of packageIds) {
        const pkg = {
          type: 'gem',
          name: packageId,
        };
        const pkgRegistered = project.packages.find(
          (p) => p.type === pkg.type && p.name === pkg.name,
        );
        if (!pkgRegistered) {
          const gemExists = await fetch(
            `https://rubygems.org/api/v1/gems/${packageId}.json`,
          )
            .then((res) => (res.status === 200 ? true : false))
            .catch(() => false);
          if (!gemExists) {
            logger.info(
              `- ${packageId} is not registered on rubygems. Ignoring.`,
            );
            continue;
          }
          project.packages.push(pkg);
        }
      }
    }
  }

  await saveProjects(projects);
})();
