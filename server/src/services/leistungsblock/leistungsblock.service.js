// Initializes the `leistungsblock` service on path `/leistungsblock`
const createService = require('feathers-knex');
const createModel = require('../../models/leistungsblock.model');
const hooks = require('./leistungsblock.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'leistungsblock',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/leistungsblock', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('leistungsblock');

  service.hooks(hooks);
};
  