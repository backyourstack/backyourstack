import '../env';

import { uniq, pick, get } from 'lodash';

import { fetchWithOctokit, fetchFileFromRepo, getContent, silentError } from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexps = [
  /https:\/\/packagist\.org\/packages\/([a-z0-9-]*\/[a-z0-9-]*)/gi,
  /https:\/\/img\.shields\.io\/packagist\/[^/]+\/([a-z0-9-]*\/[a-z0-9-]*).svg/gi,
];

(async () => {

  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];

    for (const repo of collective.repos) {
      if (repo.languages.indexOf('PHP') !== -1) {

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

        // 2. Detect project name in composer.json
        if (repo.files.indexOf('composer.json') !== -1) {
          const composerJson = await fetchFileFromRepo(repo, 'composer.json').then(JSON.parse).catch(silentError);
          if (composerJson && composerJson.name) {
            packageIds.push(composerJson.name);
          }
        }

      }
    }

    packageIds = uniq(packageIds).filter(packageId => !!packageId);

    if (packageIds.length) {
      console.log(`Collective: ${collective.slug} ${collective.name}`);
      console.log(packageIds);
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
          'type': 'composer',
          'name': packageId,
        };
        const pkgRegistered = project.packages.find(p => p.type === pkg.type && p.name === pkg.name);
        if (!pkgRegistered) {
          const packagistExists = await fetch(`https://repo.packagist.org/p/${packageId}.json`)
            .then(res => res.status === 200 ? true : false)
            .catch(() => false);
          if (!packagistExists) {
            console.log(`- ${packageId} is not registered on packagist. Ignoring.`);
            continue;
          }
          project.packages.push(pkg);
        }
      }
    }

  }

  await saveProjects(projects);

})();
