/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Application hooks that run for every service
const logger = require('./hooks/logger');
const cleanup = require('./hooks/pre-store')
const treatDeleted = require('./hooks/treat-deleted');
const softDelete = require('./hooks/softdelete')
const timings = require('./hooks/timings')
import acl from './hooks/acl'

export default {
  before: {
    all: [logger(), acl],
    find: [treatDeleted()],
    get: [],
    create: [cleanup],
    update: [cleanup],
    patch: [cleanup],
    remove: [softDelete]
  },

  after: {
    all: [logger()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [logger()],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
