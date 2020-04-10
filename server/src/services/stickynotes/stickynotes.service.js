// Initializes the `stickynotes` service on path `/stickynotes`
const { Stickynotes } = require('./stickynotes.class');
const createModel = require('../../models/stickynotes.model');
const hooks = require('./stickynotes.hooks');

module.exports = function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/stickynotes', new Stickynotes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stickynotes');

  service.hooks(hooks);
};
