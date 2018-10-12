/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/agntermine.model');
const hooks = require('./agntermine.hooks');
const validator=require('../validator').initialize

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'agntermine',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/termin', createService(options));

  // initialize validator with column info
  Model('agntermine').columnInfo().then(columns=>{
    validator('agntermine',columns)
  })
  // Get our initialized service so that we can register hooks and filters
  const service = app.service('termin');
  service.hooks(hooks);
};
