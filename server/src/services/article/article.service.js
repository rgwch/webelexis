/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/article.model');
const hooks = require('./article.hooks');

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'artikelstamm_ch',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/article', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('article');

  service.hooks(hooks);
};
