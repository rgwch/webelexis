// Initializes the `labresults` service on path `/labresults`
const createService = require('./labresults.class.js');
import createModel from '../../models/labresult.model'
const hooks = require('./labresults.hooks');


module.exports = function (app) {

  const paginate = app.get('paginate');
  const Model = createModel(app)

  const options = {
    name: "labresults",
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/labresults', createService(app, options));

  // Get our initialized service so that we can register hooks
  const service = app.service('labresults');

  service.hooks(hooks);
};
