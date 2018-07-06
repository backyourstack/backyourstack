import request from 'graphql-request';

import cache from './cache';

const baseUrl = 'https://opencollective.com/api/graphql';

const getCollectiveWithBackingQuery = `query Collective($slug: String!) {
  Collective(slug: $slug) {
    id
    type
    slug
    name
    backing: memberOf(role: "BACKER", limit: 100) {
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

const getCollectiveWithMembersQuery = `query Collective($slug: String!) {
  Collective(slug: $slug) {
    id
    type
    slug
    name
    description
    stats {
      balance
      yearlyBudget
    }
    settings
    members {
      role
      createdAt
      stats {
        totalDonations
      }
      member {
        id
        type
        name
        slug
      }
    }
  }
}
`;

function fetchCollectiveWithBacking (slug) {
  const cacheKey = `collective_with_backing_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrl, getCollectiveWithBackingQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    })
    .catch(() => {
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchCollectiveWithMembers (slug) {
  const cacheKey = `collective_with_members_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrl, getCollectiveWithMembersQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    })
    .catch(() => {
      cache.set(cacheKey, null);
      return null;
    });
}


export {
  fetchCollectiveWithBacking,
  fetchCollectiveWithMembers,
};
