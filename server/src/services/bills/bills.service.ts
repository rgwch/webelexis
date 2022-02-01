/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

// Initializes the `bills` service on path `/bills`
import { Bills } from './bills.class'
const createModel = require('../../models/bills.model')
import hooks from './bills.hooks'

export default (app) => {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate'),
  }

  // Initialize our service with any options it requires
  app.use('/bills', new Bills(options, app))

  // Get our initialized service so that we can register hooks
  const service = app.service('bills')

  service.hooks(hooks)
}
