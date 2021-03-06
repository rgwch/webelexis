// Initializes the `createpdf` service on path `/createpdf`
const createService = require('./createpdf.class.js');
const hooks = require('./createpdf.hooks');

module.exports = function (app) {
  
  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/createpdf', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('createpdf');

  service.hooks(hooks);
};
