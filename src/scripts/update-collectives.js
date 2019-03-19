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

async function getCollectiveRepos(github) {
  const githubRepo = github.repo;
  const githubOrgs = github.orgs ? github.orgs : github.org ? [github.org] : [];
  const githubUsers = github.users
    ? github.users
    : github.user
    ? [github.user]
    : [];

  let allRepos = [];

  if (githubOrgs && githubOrgs.length > 0) {
    for (const githubOrg of githubOrgs) {
      try {
        const reposListForOrgParameters = {
          org: githubOrg,
          page: 1,
          per_page: 100,
        };
        while (true) {
          // https://octokit.github.io/rest.js/#api-Repos-listForOrg
          const reposForOrg = await fetchWithOctokit(
            'repos.listForOrg',
            reposListForOrgParameters,
          );
          if (reposForOrg) {
            for (const repo of reposForOrg) {
              if (!repo.fork) {
                allRepos.push({
                  owner: repo.owner.login,
                  name: repo.name,
                });
              }
            }
          }
          if (reposForOrg.length < reposListForOrgParameters.per_page) {
            break;
          }
          reposListForOrgParameters.page++;
        }
      } catch (e) {
        logger.warn(`Could not fetch repos for org ${githubOrg}`);
      }
    }
  } else if (githubUsers && githubUsers.length > 0) {
    for (const githubUser of githubUsers) {
      try {
        const reposListForUserParameters = {
          username: githubUser,
          page: 1,
          per_page: 100,
        };
        while (true) {
          // https://octokit.github.io/rest.js/#api-Repos-listForUser
          const reposForUser = await fetchWithOctokit(
            'repos.listForUser',
            reposListForUserParameters,
          );
          if (reposForUser) {
            for (const repo of reposForUser) {
              if (!repo.fork) {
                allRepos.push({
                  owner: repo.owner.login,
                  name: repo.name,
                });
              }
            }
          }
          if (reposForUser.length < reposListForUserParameters.per_page) {
            break;
          }
          reposListForUserParameters.page++;
        }
      } catch (e) {
        logger.warn(`Could not fetch repos for user ${githubUser}`);
      }
    }
  } else if (githubRepo) {
    const [owner, name] = githubRepo.split('/');
    allRepos = [{ owner, name }];
  }

  return allRepos;
}

(async () => {
  const storedCollectives = await getCollectives();

  const queries = [
    // Active Open Source collectives
    {
      tags: 'open source',
      isActive: true,
      limit: 1000,
    },
    // Pledged collectives
    {
      tags: 'pledged',
      isActive: false,
      limit: 1000,
    },
  ];
  for (const query of queries) {
    const allCollectives = await fetchAllCollectives(query);

    for (const collective of allCollectives) {
      if (collective.id === 1) {
        continue;
      }

      logger.info(`Collective: ${collective.slug} ${collective.name}`);

      let github;
      if (has(collective, 'settings.githubUsers')) {
        github = { users: get(collective, 'settings.githubUsers') };
      } else if (has(collective, 'settings.githubOrgs')) {
        github = { orgs: get(collective, 'settings.githubOrgs') };
      } else if (has(collective, 'settings.githubOrg')) {
        github = { org: get(collective, 'settings.githubOrg') };
      } else if (has(collective, 'settings.githubRepo')) {
        github = { repo: get(collective, 'settings.githubRepo') };
      } else {
        const website = get(collective, 'website');
        let githubHandle = get(collective, 'githubHandle');
        if (!githubHandle && website && website.includes('github.com/')) {
          githubHandle = website
            .replace('github.com/', '')
            .replace('https://', '')
            .replace('http://', '');
        }
        if (githubHandle) {
          // This can be an user too, this should be tested
          if (githubHandle.includes('/')) {
            github = { repo: githubHandle };
          } else {
            github = { org: githubHandle };
          }
        } else {
          continue;
        }
      }

      let storedCollective = storedCollectives.find(
        c => c.id === collective.id,
      );
      if (!storedCollective) {
        storedCollective = pick(collective, [
          'id',
          'name',
          'slug',
          'description',
        ]);
        storedCollectives.push(storedCollective);
      } else {
        storedCollective = merge(
          storedCollective,
          pick(collective, ['id', 'name', 'slug', 'description']),
        );
      }

      // Pledge
      if (
        collective.tags &&
        collective.tags.includes('pledged') &&
        collective.isActive === false
      ) {
        storedCollective.pledge = true;
      } else {
        delete storedCollective.pledge;
      }

      storedCollective.github = github;
      storedCollective.repos = [];

      const repos = await getCollectiveRepos(github);
      if (!repos || !repos.length) {
        continue;
      }

      for (const repo of repos) {
        logger.verbose('Fetch repo with GraphQL', repo);
        let githubRepo;
        try {
          githubRepo = await fetchWithGraphql(repositoryQuery, repo).then(
            data => data.repository,
          );
          if (githubRepo.isFork) {
            continue;
          }
        } catch (e) {
          logger.warn(`Could not fetch repo ${repo.owner} ${repo.name}`);
          continue;
        }
        let storedRepo = storedCollective.repos.find(
          r =>
            r.name === githubRepo.name &&
            r.owner.login === githubRepo.owner.login,
        );
        if (!storedRepo) {
          storedRepo = pick(githubRepo, ['name', 'owner']);
          storedCollective.repos.push(storedRepo);
        }
        storedRepo.defaultBranch = get(
          githubRepo,
          'defaultBranchRef.name',
          'master',
        );
        storedRepo.languages = get(githubRepo, 'languages.nodes', []).map(
          node => node.name,
        );
        storedRepo.files = get(githubRepo, 'files.entries', [])
          .filter(e => e.type === 'blob')
          .map(e => e.name);
      }

      storedCollective.repos.sort(
        (a, b) =>
          a.name.localeCompare(b.name) ||
          a.owner.login.localeCompare(b.owner.login),
      );

      await saveCollectives(storedCollectives);
    }
  }
})();
