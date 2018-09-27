// Initializes the `documents` service on path `/documents`
const createService = require('feathers-nedb');
const createModel = require('../../models/documents.model');
const hooks = require('./documents.hooks');
const doctool=require('../../util/topdf')

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    id: "id",
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/documents', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('documents');
  service.toPDF=doctool.toPDF

  service.hooks(hooks);
};
