import request from 'graphql-request';

import cache from './cache';

const baseUrl = 'https://opencollective.com/api/graphql';

const getCollectiveWithBackingQuery = `
  query Collective($slug: String!) {
    Collective(slug: $slug) {
      id
      type
      slug
      name
      memberOf(role: "BACKER", limit: 100) {
        id
        role
        createdAt
        stats {
          totalDonations
        }
        collective {
          id
          name
          slug
          type
        }
      }
    }
  }`;

function fetchCollective (slug) {
  const cacheKey = `collective_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrl, getCollectiveWithBackingQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    })
    .catch(err => {
      console.error(err);
      cache.set(cacheKey, null);
      return null;
    });
}

export {
  fetchCollective,
};
