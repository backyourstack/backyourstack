import nextRoutes from 'next-routes';

const routes = nextRoutes();

routes
  .add('login')
  .add('logout')
  .add('faq')
  .add('contributing')
  .add('index', '/')
  .add('confirmed', '/confirmed')
  .add('backmystack', '/backmystack')
  .add('search', '/search')
  .add('files', '/files/:section(dependencies|repositories)?')
  .add('profile', '/:id/:section(dependencies|repositories)?');

export default routes;

export const { Link, Router } = routes;
