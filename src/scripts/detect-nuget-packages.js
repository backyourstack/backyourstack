import '../env';

import { uniq, pick, get } from 'lodash';

import { fetchWithOctokit, getContent } from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexps = [
  /https:\/\/www\.nuget\.org\/packages\/([a-z0-9-.]*)/gi,
  /https:\/\/img\.shields\.io\/nuget\/[^/]+\/([a-z0-9-.]*).svg/gi,
];

(async () => {

  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];

    for (const repo of collective.repos) {
      if (repo.languages.indexOf('C#') !== -1) {

        // 1. Detect nuget links in Readme
        const readme = await fetchWithOctokit(
          'repos.getReadme', { owner: repo.owner.login, repo: repo.name }
        ).then(getContent);
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

      }
    }

    packageIds = uniq(packageIds).filter(packageId => !!packageId);

    if (packageIds.length) {
      console.log(`Collective: ${collective.slug} ${collective.name}`);
      console.log(uniq(packageIds));
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
      for (const packageId of uniq(packageIds)) {
        const pkg = {
          'type': 'nuget',
          'name': packageId,
        };
        const pkgRegistered = project.packages.find(p => p.type === pkg.type && p.name === pkg.name);
        if (!pkgRegistered) {
          project.packages.push(pkg);
        }
      }

    }
  }

  await saveProjects(projects);

})();
