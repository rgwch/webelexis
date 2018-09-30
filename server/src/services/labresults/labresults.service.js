// Initializes the `labresults` service on path `/labresults`
const createService = require('./labresults.class.js');
const hooks = require('./labresults.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/labresults', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('labresults');

  service.hooks(hooks);
};
