/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/agntermine.model');
const hooks = require('./agntermine.hooks');
const roles = require('../roles')
const {Ability, AbilityBuilder} = require('@casl/ability')

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

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('termin');
  service.abilities={
    [roles.admin]: new Ability([{subject:'all',actions:'manage'}]),
    [roles.user]: new Ability([
      {subject: 'all', actions: ['create','update','delete']}
    ])
  }

  service.hooks(hooks);
};
