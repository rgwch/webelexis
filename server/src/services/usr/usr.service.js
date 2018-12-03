/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Initializes the `usr` service on path `/usr`
const createService = require('feathers-nedb');
const createModel = require('../../models/usr.model');
const hooks = require('./usr.hooks');
const logger = require('../../logger')

module.exports = function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'usr',
    Model,
    id: "email",
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/usr', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('usr');

  service.hooks(hooks);

  service.get("admin").then(adm => {
    logger.info("found admin user")
  }).catch(err => {
    const ucf=app.get("userconfig")
    if (!ucf || !ucf.testing) {
      const input = require('../../keyboard')
      input("Please enter admin password: ").then(async pwd => {
        try {
          const adm = await service.create({ email: "admin", password: pwd, roles: ['admin'], dummy: false })
          logger.info("created admin")
        } catch (err) {
          logger.error("could not create admin %s", err)
        }
      })
    }
  })
};
