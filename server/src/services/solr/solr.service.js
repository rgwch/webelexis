// Initializes the `solr` service on path `/solr`
const hooks = require('./solr.hooks');
const solr=require('feathers-solr')

module.exports = function (app) {

  const options=app.get("solr")

  const Service=new solr.Service(options)

  // Initialize our service with any options it requires
  app.use('/solr', Service());

  // Get our initialized service so that we can register hooks
  const service = app.service('solr');
  service.hooks(hooks);
};
