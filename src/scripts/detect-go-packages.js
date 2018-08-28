import '../env';

import fetch from 'cross-fetch';
import { uniq, pick, get } from 'lodash';

import { fetchWithOctokit, getContent, silentError } from '../lib/github';

import { getCollectives, getProjects, saveProjects } from '../data';

const regexp = /https:\/\/godoc\.org\/([a-z0-9-./]*)/gi;

(async () => {

  const projects = await getProjects();
  const collectives = await getCollectives();

  for (const collective of collectives) {
    let packageIds = [];

    for (const repo of collective.repos) {
      if (repo.languages.indexOf('Go') !== -1) {

        // 1. Detect godoc links in Readme
        const readme = await fetchWithOctokit(
          'repos.getReadme', { owner: repo.owner.login, repo: repo.name }
        ).then(getContent).catch(silentError);
        if (readme) {
          let result;
          do {
            result = regexp.exec(readme);
            if (result) {
              const packageId = result[1];
              packageIds.push(packageId);
            }
          } while (result);
        }

        // 2. Test if godoc page exists and is a package
        const godoc = await fetch(`https://godoc.org/github.com/${repo.owner.login}/${repo.name}`)
          .then(res => res.status === 200 ? res.text() : null);
        if (godoc && godoc.indexOf('<h2 id="pkg-overview">') !== -1) {
           packageIds.push(`github.com/${repo.owner.login}/${repo.name}`);
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
          'type': 'dep',
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
