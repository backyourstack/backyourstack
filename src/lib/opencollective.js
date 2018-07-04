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

  const collective = cache.get(cacheKey);
  if (collective) {
    return collective;
  }

  return request(baseUrl, getCollectiveWithBackingQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    });
}

export {
  fetchCollective,
};
