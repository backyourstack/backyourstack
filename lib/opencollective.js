import fetch from 'node-fetch';

import logger from '../logger';

import cache from './cache';

const opencollectiveBaseUrl = process.env.OPENCOLLECTIVE_BASE_URL;
const baseUrl = `${opencollectiveBaseUrl}/api/graphql`;
const baseUrlV2 = `${opencollectiveBaseUrl}/api/graphql/v2`;

const getAccountOrdersQuery = `query account($slug: String!) {
  account(slug: $slug) {
    name
    slug
    orders(status: [ACTIVE, PAID]) {
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
        status
      }
    }
  }
}`;

const getOrderQuery = `query Order($orderId: Int!) {
  Order(id: $orderId) {
    id
    totalAmount
    status
  }
}`;

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

const backyourstackDispatchOrderMutation = `
  mutation backyourstackDispatchOrder($id: Int!) {
    backyourstackDispatchOrder(id: $id) {
      dispatching
    }
  }
`;

function graphqlRequest(url, query, variables) {
  return fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      variables,
    }),
  })
    .then((result) => {
      if (!result.ok) {
        throw new Error(
          'Unable to connect with open collective, Please contact support.',
        );
      }
      return result.json();
    })
    .then((response) => {
      if (response.errors) {
        console.error(response.errors);
        throw new Error(response.errors[0].message);
      }
      return response.data;
    });
}

function fetchAccountWithOrders(slug) {
  const cacheKey = `account_with_orders_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return graphqlRequest(baseUrlV2, getAccountOrdersQuery, { slug })
    .then((data) => {
      cache.set(cacheKey, data.account);
      return data.account;
    })
    .catch(() => {
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchOrder(orderId) {
  logger.debug(`Fetching order from Open Collective: ${orderId}`);
  return graphqlRequest(baseUrl, getOrderQuery, { orderId })
    .then((data) => {
      return data.Order;
    })
    .catch(() => {
      return null;
    });
}

function fetchCollectiveWithMembers(slug) {
  const cacheKey = `collective_with_members_${slug}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  return graphqlRequest(baseUrl, getCollectiveWithMembersQuery, { slug })
    .then((data) => {
      cache.set(cacheKey, data.Collective);
      return data.Collective;
    })
    .catch((err) => {
      console.log(err);
      cache.set(cacheKey, null);
      return null;
    });
}

function fetchAllCollectives(parameters) {
  return graphqlRequest(baseUrl, getAllCollectivesQuery, parameters).then(
    (data) => data.allCollectives.collectives,
  );
}

function dispatchOrder(id) {
  return graphqlRequest(baseUrl, backyourstackDispatchOrderMutation, {
    id,
  }).then((data) => data.backyourstackDispatchOrder);
}

export {
  fetchAccountWithOrders,
  fetchOrder,
  fetchCollectiveWithMembers,
  fetchAllCollectives,
  dispatchOrder,
};
