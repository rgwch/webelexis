// Initializes the `oddb` service on path `/oddb`
const createService = require('feathers-knex');
import createModel from '../../models/oddb.model'
const hooks = require('./oddb.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'oddb',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/oddb', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('oddb');

  service.hooks(hooks);
};
