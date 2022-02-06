/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import createService from './admin.class.js';
import hooks from './admin.hooks';

export default function (app) {

  const paginate = app.get('paginate');

  const options = {
    name: 'admin',
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/admin', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('admin');

  service.hooks(hooks);
};
