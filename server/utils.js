import fetch from 'cross-fetch';

export const fetchWithBasicAuthentication =
  (username, password) => (url, params) => {
    const basicAuthenticationString = Buffer.from(
      [username, password].join(':'),
    ).toString('base64');
    params.headers = params.headers || {};
    params.headers.Authorization = `Basic ${basicAuthenticationString}`;
    return fetch(url, params);
  };
