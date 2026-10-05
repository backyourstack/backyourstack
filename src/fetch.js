export function getProfileData(id, accessToken, { excludedRepos }) {
  const params = { id };
  if (excludedRepos) {
    params.excludedRepos = excludedRepos;
  }
  const searchParams = new URLSearchParams(params);
  return typeof window !== 'undefined'
    ? fetchJson(`/data/getProfileData?${searchParams}`)
    : import('./data').then((m) =>
        m.getProfileData(id, accessToken, { excludedRepos }),
      );
}

export function fetchJson(url, params = {}) {
  params.credentials = 'same-origin';
  return fetch(url, params).then(async (res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(await res.text());
  });
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

export function getFilesData(sessionFiles) {
  return typeof window !== 'undefined'
    ? fetchJson('/data/getFilesData')
    : import('./data').then((m) => m.getFilesData(sessionFiles));
}
