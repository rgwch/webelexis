/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 const createService = require('./billable.class.js');
const hooks = require('./billable.hooks');

module.exports = function (app) {

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
