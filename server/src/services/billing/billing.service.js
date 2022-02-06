/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Elexis Leistungen bzw. "Verrechnet"

const createService = require('feathers-knex');
const createModel = require('../../models/billing.model');
const hooks = require('./billing.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'leistungen',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/billing', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('billing');

  service.hooks(hooks);
};
