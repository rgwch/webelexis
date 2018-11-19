// Initializes the `solr` service on path `/solr`
const hooks = require('./solr.hooks');
const createService=require('./solr.class')

module.exports = function (app) {

  const options=app.get("solr")


  // Initialize our service with any options it requires
  app.use('/solr', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('solr');
  service.hooks(hooks);
};
