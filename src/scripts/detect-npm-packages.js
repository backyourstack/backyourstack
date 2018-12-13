import '../env';
import logger from '../logger';

import fetch from 'cross-fetch';
import { uniq, pick, get } from 'lodash';

import {
  fetchWithOctokit,
  fetchFileFromRepo,
  getContent,
  silentError,
} from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexps = [
  /https:\/\/npmjs\.org\/package\/([@a-z0-9-/]*)/gi,
  /https:\/\/www\.npmjs\.com\/packages\/([@a-z0-9-/]*)/gi,
  /https:\/\/img\.shields\.io\/npm\/[^/]+\/([@a-z0-9-/]*).svg/gi,
];

(async () => {
  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];
    for (const repo of collective.repos) {
      if (
        repo.languages.indexOf('JavaScript') !== -1 ||
        repo.languages.indexOf('TypeScript') !== -1
      ) {
        // 1. Detect npm links in Readme
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

        // 2. Detect project name in package.json
        if (repo.files.indexOf('package.json') !== -1) {
          const packageJson = await fetchFileFromRepo(repo, 'package.json')
            .then(JSON.parse)
            .catch(silentError);
          if (packageJson && packageJson.name && packageJson.private !== true) {
            packageIds.push(packageJson.name);
          }
        }

        // 3. Lerna
        if (repo.files.indexOf('lerna.json') !== -1) {
          let lernaPackages, lernaFolderName;
          for (lernaFolderName of ['packages', 'modules', 'app']) {
            lernaPackages = await fetchWithOctokit('repos.getContents', {
              owner: repo.owner.login,
              repo: repo.name,
              path: lernaFolderName,
            }).catch(silentError);
            if (lernaPackages) {
              break;
            }
          }
          lernaPackages = (lernaPackages || []).filter(
            result => result.type === 'dir',
          );
          for (const lernaPackage of lernaPackages) {
            const lernaPackageJson = await fetchFileFromRepo(
              repo,
              `${lernaFolderName}/${lernaPackage.name}/package.json`,
            )
              .then(JSON.parse)
              .catch(silentError);
            if (
              lernaPackageJson &&
              lernaPackageJson.name &&
              lernaPackageJson.private !== true
            ) {
              packageIds.push(lernaPackageJson.name);
            }
          }
        }
      }
    }

    packageIds = uniq(packageIds).filter(packageId => !!packageId);

    if (packageIds.length) {
      logger.info(`Collective: ${collective.slug} ${collective.name}`, {
        packageIds,
      });
      let project = projects.find(
        p => get(p, 'opencollective.id') === collective.id,
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
          type: 'npm',
          name: packageId,
        };
        const pkgRegistered = project.packages.find(
          p => p.type === pkg.type && p.name === pkg.name,
        );
        if (!pkgRegistered) {
          const npmExists = await fetch(
            `https://registry.npmjs.org/${packageId}`,
          )
            .then(res => (res.status === 200 ? true : false))
            .catch(() => false);
          if (!npmExists) {
            logger.info(`- ${packageId} is not registered on npm. Ignoring.`);
            continue;
          }
          project.packages.push(pkg);
        }
      }
    }
  }

  await saveProjects(projects);
})();
