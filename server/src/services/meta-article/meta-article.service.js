/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('./meta-article.class.js');
const hooks = require('./meta-article.hooks');

module.exports = function (app) {

  const paginate = app.get('paginate');

  const options = {
    app,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/meta-article', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('meta-article');

  service.hooks(hooks);
};
