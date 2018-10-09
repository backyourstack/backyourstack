import logger from '../logger';

function fetchDebug(result) {
  logger.debug(result);
  return result;
}

export function fetchJson(url, params = {}) {
  params.credentials = 'same-origin';
  return fetch(url, params)
    .then(res => res.json())
    .then(fetchDebug);
}
