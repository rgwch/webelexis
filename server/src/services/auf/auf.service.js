/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Initializes the `auf` service on path `/auf`
const createService = require('feathers-knex');
const createModel = require('../../models/auf.model');
const hooks = require('./auf.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'auf',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/auf', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('auf');

  service.hooks(hooks);
};
