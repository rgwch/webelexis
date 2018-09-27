/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/konsultation.model');
const hooks = require('./konsultation.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'behandlungen',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/konsultation', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('konsultation');

  service.hooks(hooks);
};
