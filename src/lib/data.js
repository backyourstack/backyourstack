import fetch from 'cross-fetch';

import { fetchWithOctokit, fetchProfile, fetchReposForProfile } from './github';

import { fetchCollectiveWithBacking } from './opencollective';

import {
  addProjectToDependencies,
  getAllDependenciesFromRepos,
  getRecommendedProjectFromDependencies,
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

export async function getProfileData(id, accessToken) {
  const profile = await fetchProfile(id, accessToken);

  const slug = githubToOpenCollectiveMapping[profile.login] || profile.login;
  const opencollective = await fetchCollectiveWithBacking(slug);

  const repos = await fetchReposForProfile(profile, accessToken).then(repos =>
    Promise.all(
      repos.map(async repo => {
        const dependencies = await getDependenciesFromGithubRepo(
          repo,
          accessToken,
        );
        // eslint-disable-next-line require-atomic-updates
        repo.dependencies = dependencies;
        return repo;
      }),
    ),
  );

  const dependencies = await addProjectToDependencies(
    getAllDependenciesFromRepos(repos),
  );

  const recommendations = await getRecommendedProjectFromDependencies(
    dependencies,
  );

  return { profile, opencollective, repos, dependencies, recommendations };
}

export async function getFilesData(sessionFiles) {
  if (!sessionFiles) {
    return { files: {}, repos: [], dependencies: [], recommendations: [] };
  }

  const files = sessionFiles;

  const repos = Object.keys(sessionFiles).map(id => {
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
