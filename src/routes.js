import nextRoutes from 'next-routes';

const routes = nextRoutes();

routes
  .add('login')
  .add('logout')
  .add('faq')
  .add('contributing')
  .add('index', '/')
  .add('homepage', '/v2')
  .add('search', '/search')
  .add('files', '/files/:section(dependencies|repositories)?')
  .add('monthly-plan', '/monthly-plan')
  .add('monthly-plan-confirmation', '/:id/monthly-plan/confirmation')
  .add('profile', '/:id/:section(dependencies|repositories)?')
  .add('badge', '/:id/badge/:type(default|compact)?');

export default routes;

export const { Link, Router } = routes;
