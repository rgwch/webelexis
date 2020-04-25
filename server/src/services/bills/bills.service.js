// Initializes the `bills` service on path `/bills`
const { Bills } = require('./bills.class');
const createModel = require('../../models/bills.model');
const hooks = require('./bills.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/bills', new Bills(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('bills');

  service.hooks(hooks);
};
