/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks
import {store,retrieve} from './briefe.util'


export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [store],
    update: [store],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [retrieve],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
