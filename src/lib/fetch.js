import logger from '../logger';

function fetchDebug(result) {
  logger.debug(result);
  return result;
}

function getProfileData(id, accessToken, excludedRepos) {
  const params = { id };
  if (excludedRepos) {
    params.excludedRepos = excludedRepos;
  }
  const searchParams = new URLSearchParams(params);
  return process.env.IS_CLIENT
    ? fetchJson(`/data/getProfileData?${searchParams}`)
    : import('../lib/data').then(m =>
        m.getProfileData(id, accessToken, { excludedRepos }),
      );
}

export function fetchJson(url, params = {}) {
  params.credentials = 'same-origin';
  return fetch(url, params)
    .then(res => res.json())
    .then(fetchDebug);
}

export function postJson(url, body, params = {}) {
  params.method = 'POST';
  params.headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  params.body = JSON.stringify(body);
  return fetchJson(url, params);
}

export function getData(options = {}) {
  if (options.type === 'file') {
    return process.env.IS_CLIENT
      ? fetchJson('/data/getFilesData')
      : import('../lib/data').then(m => m.getFilesData(options.sessionFiles));
  }

  return getProfileData(options.id, options.accessToken, options.excludedRepos);
}
