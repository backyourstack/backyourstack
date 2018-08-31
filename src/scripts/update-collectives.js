import '../env';
import logger from '../logger';

import { get, has, pick, merge } from 'lodash';

import { fetchAllCollectives } from '../lib/opencollective';
import { fetchWithOctokit, fetchWithGraphql } from '../lib/github';

import { getCollectives, saveCollectives } from '../data';

const repositoryQuery = `query repository($owner: String!, $name: String!) {
  repository(owner: $owner, name: $name) {
    name
    owner {
      login
    }
    isFork
    defaultBranchRef {
      name
    }
    languages(first: 100) {
      nodes {
        name
      }
    }
    files: object(expression: "HEAD:") {
      ... on Tree {
        entries {
          name
          type
        }
      }
    }
  }
}`;

async function getCollectiveRepos (collective) {
  const repos = get(collective, 'data.repos');
  const githubOrg = get(collective, 'settings.githubOrg');
  const githubRepo = get(collective, 'settings.githubRepo');

  let allRepos = [];

  if (githubOrg) {
    if (repos) {
      allRepos = Object.keys(repos).map(name => ({ owner: githubOrg, name }));
    } else {
      try {
        const reposForOrg = await fetchWithOctokit('repos.getForOrg', { org: githubOrg, per_page: 100 });
        if (repos) {
          allRepos = reposForOrg.map(repo => ({ owner: repo.owner.login, name: repo.name }));
        }
      } catch (e) {
        logger.warn(`Could not fetch repos for org ${githubOrg}`);
      }
    }
  } else if (githubRepo) {
    const [ owner, name ] = githubRepo.split('/');
    allRepos = [ { owner, name } ];
  }

  return allRepos;
}

(async () => {

  const storedCollectives = await getCollectives();

  const allCollectives = await fetchAllCollectives(11004, 'COLLECTIVE', true, 1000);

  for (const collective of allCollectives) {

    if (collective.id === 1) {
      continue;
    }

    logger.info(`Collective: ${collective.slug} ${collective.name}`);

    let github;
    if (has(collective, 'settings.githubOrg')) {
      github = { org: get(collective, 'settings.githubOrg') };
    } else if (has(collective, 'settings.githubRepo')) {
      github = { repo: get(collective, 'settings.githubRepo') };
    } else {
      continue;
    }

    let storedCollective = storedCollectives.find(c => c.id === collective.id);
    if (!storedCollective) {
      storedCollective = pick(collective, ['id', 'name', 'slug', 'description']);
      storedCollectives.push(storedCollective);
    } else {
      storedCollective = merge(storedCollective, pick(collective, ['id', 'name', 'slug', 'description']));
    }
    storedCollective.github = github;
    storedCollective.repos = [];

    const repos = await getCollectiveRepos(collective);
    if (!repos || !repos.length) {
      continue;
    }

    for (const repo of repos) {
      let githubRepo;
      try {
        githubRepo = await fetchWithGraphql(repositoryQuery, repo).then(data => data.repository);
        if (githubRepo.isFork) {
          continue;
        }
      } catch (e) {
        logger.warn(`Could not fetch repo ${repo.owner} ${repo.name}`);
        continue;
      }
      let storedRepo = storedCollective.repos.find(r => r.name === githubRepo.name && r.owner.login === githubRepo.owner.login);
      if (!storedRepo) {
        storedRepo = pick(githubRepo, ['name', 'owner']);
        storedCollective.repos.push(storedRepo);
      }
      storedRepo.defaultBranch = get(githubRepo, 'defaultBranchRef.name', 'master');
      storedRepo.languages = get(githubRepo, 'languages.nodes', []).map(node => node.name);
      storedRepo.files = get(githubRepo, 'files.entries', []).filter(e => e.type === 'blob').map(e => e.name);
    }

    storedCollective.repos.sort((a, b) => a.name.localeCompare(b.name) || a.owner.login.localeCompare(b.owner.login));

    await saveCollectives(storedCollectives);
  }

})();
