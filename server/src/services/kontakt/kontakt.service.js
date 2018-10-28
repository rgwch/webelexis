/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/kontakt.model');
const hooks = require('./kontakt.hooks');

module.exports = async function (app) {
  const Model = await createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'kontakt',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/kontakt', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('kontakt');

  service.hooks(hooks);
};
