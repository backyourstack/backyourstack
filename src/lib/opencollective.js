import request from 'graphql-request';

import cache from './cache';

const opencollectiveUrl = process.env.OPENCOLLECTIVE_URL;
const baseUrl = `${opencollectiveUrl}/api/graphql`;
const baseUrlV2 = `${opencollectiveUrl}/api/graphql/v2`;

const getAccountOrdersQuery = `query account($slug: String!) {
  account(slug: $slug) {
    name
    slug
    orders(status: ACTIVE) {
      nodes {
        amount {
          value
        }
        toAccount {
          slug
        }
        totalDonations {
          value
        }
        frequency
        createdAt
      }
    }
  }
}`;

const getOrder = `
query getOrder($id: Int!) {
  Order(id: $id) {
    id
    interval
    publicMessage
    quantity
    totalAmount
    status
    data
    collective {
      slug
      currency
      host {
        id
        name
      }
      isActive
      name
      paymentMethods {
        id
        name
        service
      }
      website
    }
    fromCollective {
      id
      name
      type
    }
  }
}
`;

const getCollectiveWithMembersQuery = `query Collective($slug: String!) {
  Collective(slug: $slug) {
    id
    type
    slug
    name
    description
    website
    githubHandle
    tags
    isPledged
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
    isActive
  }
}
`;

const getAllCollectivesQuery = `query allCollectives(
    $HostCollectiveId: Int,
    $isActive: Boolean,
    $limit: Int,
    $type: TypeOfCollective,
    $tags: [String]
  ) {
  allCollectives(
    HostCollectiveId: $HostCollectiveId,
    isActive: $isActive,
    limit: $limit,
    type: $type
    tags: $tags
  ) {
    total
    limit
    offset
    collectives {
      id
      type
      slug
      name
      description
      website
      githubHandle
      tags
      stats {
        balance
        yearlyBudget
      }
      settings
      data
      isActive
    }
  }
}
`;

function fetchAccountWithOrders(slug) {
  const cacheKey = `account_with_orders_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrlV2, getAccountOrdersQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.account);
      return data.account;
    })
    .catch(() => {
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchOrder(id) {
  const cacheKey = `order_with_id_${id}`;
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrl, getOrder, { id })
    .then(data => {
      cache.set(cacheKey, data.Order);
      return data.Order;
    })
    .catch(err => {
      console.error(err);
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchCollectiveWithMembers(slug) {
  const cacheKey = `collective_with_members_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return request(baseUrl, getCollectiveWithMembersQuery, { slug })
    .then(data => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    })
    .catch(err => {
      console.log(err);
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchAllCollectives(parameters) {
  return request(baseUrl, getAllCollectivesQuery, parameters).then(
    data => data.allCollectives.collectives,
  );
}

export {
  fetchAccountWithOrders,
  fetchCollectiveWithMembers,
  fetchAllCollectives,
  fetchOrder,
};
