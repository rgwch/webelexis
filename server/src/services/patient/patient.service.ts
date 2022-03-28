/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Use DIY Service instead of feathers default service
import createService from './patient.class';
import hooks from './patient.hooks';

export default function (app) {

  const paginate = app.get('paginate');

  const options = {
    app,
    name: 'patient',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/patient', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('patient');

  service.hooks(hooks);
};
