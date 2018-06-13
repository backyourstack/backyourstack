const routes = require('next-routes')();

routes
  .add('login')
  .add('logout')
  .add('index', '/')
  .add('profile', '/:id');

module.exports = routes;
