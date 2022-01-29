// Initializes the `invoice` service on path `/invoice`
const createService = require('./invoice.class.js');
const hooks = require('./invoice.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invoice', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoice');

  service.hooks(hooks);
};
