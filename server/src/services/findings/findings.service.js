// Initializes the `findings` service on path `/findings`
const createService = require('feathers-nedb');
const createModel = require('../../models/findings.model');
const hooks = require('./findings.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/findings', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('findings');

  service.hooks(hooks);
};
