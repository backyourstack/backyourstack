import fetch from 'cross-fetch';

import { getFile, getFiles, getObjectsMetadata } from './s3';

import { fetchWithOctokit, fetchProfile, fetchReposForProfile } from './github';

import { fetchAccountWithOrders, fetchOrder } from './opencollective';

import {
  addProjectToDependencies,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
  parseToBoolean,
} from './utils';

import { getDependenciesFromGithubRepo } from './dependencies/data';
import { dependenciesStats } from './dependencies/utils';

import githubToOpenCollectiveMapping from '../data/githubToOpenCollectiveMapping.json';

export function getProfile(slug, accessToken) {
  return fetchProfile(slug, accessToken);
}

export function getUserOrgs(accessToken) {
  // https://octokit.github.io/rest.js/#api-Orgs-listForAuthenticatedUser
  return fetchWithOctokit('orgs.listForAuthenticatedUser', {}, accessToken);
}

export function searchUsers(q, accessToken) {
  return fetchWithOctokit('search.users', { q }, accessToken);
}

export async function getProfileData(id, accessToken, options = {}) {
  const profile = await fetchProfile(id, accessToken);

  const slug = githubToOpenCollectiveMapping[profile.login] || profile.login;
  const opencollectiveAccount = await fetchAccountWithOrders(slug);

  const repos = await fetchReposForProfile(
    profile,
    accessToken,
    options.loggedInUsername,
  ).then((repos) => {
    return Promise.all(
      repos.map(async (repo) => {
        if (
          !options.excludedRepos ||
          (options.excludedRepos &&
            options.excludedRepos.indexOf(repo.name) === -1)
        ) {
          repo.dependencies = await getDependenciesFromGithubRepo(
            repo,
            accessToken,
          );
          repo.checked = true;
        } else {
          repo.checked = false;
          repo.dependencies = [];
        }
        return repo;
      }),
    );
  });

  const dependencies = await addProjectToDependencies(
    getAllDependenciesFromRepos(repos),
  );

  const recommendations = await getRecommendedProjectFromDependencies(
    dependencies,
  );

  let order;
  if (parseToBoolean(process.env.SHOW_BACK_MY_STACK)) {
    order = await getProfileOrder(id);
  }
  if (order) {
    order = await fetchOrder(order.id);
  }

  return {
    profile,
    opencollectiveAccount,
    repos,
    dependencies,
    recommendations,
    order,
  };
}

export async function getFilesData(sessionFiles) {
  if (!sessionFiles) {
    return { files: {}, repos: [], dependencies: [], recommendations: [] };
  }

  const files = sessionFiles;

  const repos = Object.keys(sessionFiles).map((id) => {
    const file = sessionFiles[id];
    return {
      id,
      name: file.projectName || 'Unnamed project',
      dependencies: dependenciesStats(file),
      ...file,
    };
  });

  const dependencies = await addProjectToDependencies(
    getAllDependenciesFromRepos(repos),
  );

  const recommendations = await getRecommendedProjectFromDependencies(
    dependencies,
  );

  return { files, repos, dependencies, recommendations };
}

export const getSavedFilesData = async (id) => {
  const files = await getFiles(id);
  if (!files) {
    return null;
  }
  const data = await getFilesData(files);
  let order;
  if (parseToBoolean(process.env.SHOW_BACK_MY_STACK)) {
    order = await getProfileOrder(id);
  }
  if (order) {
    order = await fetchOrder(order.id);
  }
  return { ...data, order };
};

export const getSavedSelectedDependencies = async (id) => {
  const { selectedDependencies } = await getObjectsMetadata(id);
  if (selectedDependencies) {
    return selectedDependencies;
  }
  return null;
};

export function emailSubscribe(email, profile) {
  const username = 'anystring';
  const password = process.env.MAILCHIMP_API_KEY;

  const basicAuthenticationString = Buffer.from(
    [username, password].join(':'),
  ).toString('base64');

  return fetch(process.env.MAILCHIMP_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuthenticationString}`,
      'Content-Type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify({
      members: [
        {
          email_address: email,
          status: 'subscribed',
          merge_fields: {
            PROFILE: profile,
          },
        },
      ],
      update_existing: true,
    }),
  });
}

export const getProfileOrder = async (id) => {
  try {
    const file = await getFile(`${id}/order.json`);
    if (file) {
      return JSON.parse(file);
    }
  } catch (err) {
    return;
  }
};
