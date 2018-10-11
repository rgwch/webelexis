/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Application hooks that run for every service
const logger = require('./hooks/logger');
const update = require('./hooks/updatecommon')
const create = require('./hooks/createcommon')
const treatDeleted = require('./hooks/treat-deleted');


const abilities = require('./hooks/abilities');


module.exports = {
  before: {
    all: [logger()],
    find: [treatDeleted()],
    get: [],
    create: [create()],
    update: [update()],
    patch: [update()],
    remove: []
  },

  after: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [ logger() ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
