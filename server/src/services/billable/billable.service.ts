/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import createService from './billable.class.js';
import hooks from './billable.hooks'

export default function (app) {

  const paginate = app.get('paginate');

  const options = {
    app,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/billable', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('billable');

  service.hooks(hooks);
};
