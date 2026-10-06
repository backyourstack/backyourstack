// Named routes, replacing the unmaintained next-routes with the same API:
// <Link route="profile" params={{ id }}><a>…</a></Link> and Router.pushRoute(name, params)

import NextRouter from 'next/router';
import React from 'react';

const routeDefinitions = [
  { name: 'login', page: '/login', regex: /^\/login$/ },
  // Served by Express (see src/index.js), not by a Next.js page
  { name: 'logout', regex: /^\/logout$/ },
  { name: 'faq', page: '/faq', regex: /^\/faq$/ },
  { name: 'contributing', page: '/contributing', regex: /^\/contributing$/ },
  { name: 'index', page: '/', path: '/', regex: /^\/(?:v1)?$/ },
  {
    name: 'homepage',
    page: '/homepage',
    path: '/homepage',
    regex: /^\/(?:v2|homepage)$/,
  },
  { name: 'search', page: '/search', regex: /^\/search$/ },
  {
    name: 'files',
    page: '/files',
    regex: /^\/files(?:\/(dependencies|repositories))?$/,
    keys: ['section'],
    toPath: ({ section }) => (section ? `/files/${section}` : '/files'),
  },
  { name: 'monthly-plan', page: '/monthly-plan', regex: /^\/monthly-plan$/ },
  {
    name: 'monthly-plan-confirmation',
    page: '/monthly-plan-confirmation',
    regex: /^\/([^/.]+)\/monthly-plan\/confirmation$/,
    keys: ['id'],
    toPath: ({ id }) => `/${id}/monthly-plan/confirmation`,
  },
  {
    name: 'profile',
    page: '/profile',
    regex: /^\/([^/.]+)(?:\/(dependencies|repositories))?$/,
    keys: ['id', 'section'],
    toPath: ({ id, section }) => (section ? `/${id}/${section}` : `/${id}`),
  },
];

const routes = routeDefinitions.map((route) => ({
  keys: [],
  toPath: () => route.path || `/${route.name}`,
  ...route,
}));

const toQueryString = (params) => {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null) {
      searchParams.set(key, value);
    }
  }
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

const findRoute = (name) => {
  const route = routes.find((route) => route.name === name);
  if (!route) {
    throw new Error(`Unknown route: ${name}`);
  }
  return route;
};

// Match a pathname with a route, returns { route, params } or null
export const match = (pathname) => {
  for (const route of routes) {
    const result = route.regex.exec(pathname);
    if (result) {
      const params = {};
      route.keys.forEach((key, index) => {
        if (result[index + 1] !== undefined) {
          params[key] = result[index + 1];
        }
      });
      return { route, params };
    }
  }
  return null;
};

// Returns the Next.js { href, as } for a route name and params, or for a URL
export const getLinkProps = (nameOrUrl, params = {}) => {
  let route, as;
  if (nameOrUrl.startsWith('/')) {
    const url = new URL(nameOrUrl, 'http://localhost');
    const matched = match(url.pathname);
    if (!matched) {
      return { as: nameOrUrl };
    }
    route = matched.route;
    params = { ...Object.fromEntries(url.searchParams), ...matched.params };
    as = nameOrUrl;
  } else {
    route = findRoute(nameOrUrl);
    const queryParams = { ...params };
    route.keys.forEach((key) => delete queryParams[key]);
    as = `${route.toPath(params)}${toQueryString(queryParams)}`;
  }
  if (!route.page) {
    return { as };
  }
  return { href: { pathname: route.page, query: params }, as };
};

export const Router = {
  pushRoute(nameOrUrl, params) {
    const { href, as } = getLinkProps(nameOrUrl, params);
    if (!href) {
      window.location.href = as;
      return Promise.resolve(true);
    }
    return NextRouter.push(href, as);
  },
};

const isModifiedEvent = (event) =>
  event.metaKey ||
  event.ctrlKey ||
  event.shiftKey ||
  event.altKey ||
  event.button !== 0 ||
  (event.currentTarget.target && event.currentTarget.target !== '_self');

// Like next/link's former `legacyBehavior`: the child <a> is rendered as is (keeping its
// styled-jsx scope), with the href set and client-side navigation on click
export const Link = ({ route, params, children }) => {
  const { href, as } = getLinkProps(route, params);
  const child = React.Children.only(children);
  const onClick = (event) => {
    if (child.props.onClick) {
      child.props.onClick(event);
    }
    if (href && !event.defaultPrevented && !isModifiedEvent(event)) {
      event.preventDefault();
      NextRouter.push(href, as);
    }
  };
  return React.cloneElement(child, { href: as, onClick });
};

// Express handler rendering the Next.js page of the matching route
export const getRequestHandler = (nextApp) => {
  const handle = nextApp.getRequestHandler();
  return (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const matched = match(url.pathname);
    if (matched && matched.route.page) {
      const query = {
        ...Object.fromEntries(url.searchParams),
        ...matched.params,
      };
      return handle(req, res, { pathname: matched.route.page, query });
    }
    return handle(req, res);
  };
};
