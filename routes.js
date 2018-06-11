const routes = require('next-routes')()

routes
  .add('index', '/', 'index')
  .add('login', '/login', 'login')
  .add('profile', '/:id', 'profile');

module.exports = routes;
