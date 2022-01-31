/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/konsultation.model');
import hooks from './konsultation.hooks';

export default (app) => {
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
