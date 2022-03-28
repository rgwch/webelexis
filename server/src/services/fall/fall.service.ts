/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
import createModel from '../../models/fall.model'
import hooks from './fall.hooks'

export default function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'faelle',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/fall', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('fall');

  service.hooks(hooks);
};
