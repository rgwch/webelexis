/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex')
import createModel from '../../models/stock_entry.model'
import hooks from './stock_entry.hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'stock_entry',
    Model,
    paginate,
  }

  // Initialize our service with any options it requires
  app.use('/stock', createService(options))

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stock')

  service.hooks(hooks)
}
