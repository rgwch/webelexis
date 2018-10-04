// Initializes the `stickers` service on path `/stickers`
const createService = require('feathers-knex');
const createModel = require('../../models/stickers.model');
const hooks = require('./stickers.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'stickers',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/stickers', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stickers');

  service.hooks(hooks);
};
  