/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex')
import createModel from '../../models/agntermine.model'
import hooks from './agntermine.hooks'
import { initialize } from '../validator'

export default async function (app) {
  const Model = await createModel(app)
  const paginate = app.get('paginate')

  const options = {
    name: 'agntermine',
    Model,
    paginate,
  }

  // Initialize our service with any options it requires
  app.use('/termin', createService(options))

  // initialize validator with column info
  const columns = await Model('agntermine').columnInfo()
  initialize('agntermine', columns)

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('termin')
  service.hooks(hooks)
}
