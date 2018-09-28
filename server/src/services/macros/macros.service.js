// Initializes the `macros` service on path `/macros`
const createService = require('feathers-nedb');
const createModel = require('../../models/macros.model');
const hooks = require('./macros.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    id: "name",
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/macros', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('macros');

  service.hooks(hooks);
};
