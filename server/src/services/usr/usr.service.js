/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Initializes the `usr` service on path `/usr`
const createService = require('feathers-nedb');
const createModel = require('../../models/usr.model');
const hooks = require('./usr.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'usr',
    Model,
    id: "email",
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/usr', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usr');

  service.hooks(hooks);
};
