// Initializes the `tarmed` service on path `/tarmed`
const createService = require('feathers-knex');
const createModel = require('../../models/tarmed.model');
const hooks = require('./tarmed.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'tarmed',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/tarmed', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('tarmed');

  service.hooks(hooks);
};
