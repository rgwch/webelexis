/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-nedb');
const createModel = require('../../models/templates.model');
const hooks = require('./templates.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/templates', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('templates');

  service.hooks(hooks);
};
