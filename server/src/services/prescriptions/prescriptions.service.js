/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Initializes the `prescriptions` service on path `/rezept`
const createService = require('feathers-knex');
const createModel = require('../../models/prescriptions.model');
const hooks = require('./prescriptions.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'patient_artikel_joint',
    Model,
    paginate:{
      default:100,
      max:500
    }
  };

  // Initialize our service with any options it requires
  app.use('/prescriptions', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('prescriptions');

  service.hooks(hooks);
};
