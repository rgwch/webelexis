// Initializes the `briefe` service on path `/briefe`
const createService = require('feathers-knex');
const createModel = require('../../models/briefe.model');
const hooks = require('./briefe.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'briefe',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/briefe', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('briefe');

  service.hooks(hooks);
};
  