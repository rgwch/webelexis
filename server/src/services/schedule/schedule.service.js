// Initializes the `schedule` service on path `/schedule`
const createService = require('./schedule.class.js');
const hooks = require('./schedule.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    app,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/schedule', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('schedule');

  service.hooks(hooks);
};
