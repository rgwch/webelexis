/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import hooks from './findings.hooks'
import { Finding } from './findings.class'

export default function (app) {
  const options = app.get("findings") || {}
  const paginate = app.get('paginate')


  // Initialize our service with any options it requires
  app.use('/findings', new Finding(app, options))

  // Get our initialized service so that we can register hooks
  const service = app.service('findings')
  // service.hooks(hooks)
}
