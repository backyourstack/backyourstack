import nextRoutes from 'next-routes';

const routes = nextRoutes();

routes
  .add('login')
  .add('logout')
  .add('index', '/')
  .add('search', '/search')
  .add('files', '/files')
  .add('profile', '/:id');

export default routes;

export const { Link, Router } = routes;
