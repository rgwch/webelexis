// Initializes the `lucinda` service on path `/lucinda`
const createService = require('./lucinda.class.js');
const hooks = require('./lucinda.hooks');

module.exports = function (app) {

  const options=app.get("lucinda")
  // Initialize our service with any options it requires
  app.use('/lucinda', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('lucinda');

  service.hooks(hooks);
};
