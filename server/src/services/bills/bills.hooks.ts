/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/


const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtinfo = require('../../hooks/handle-extinfo')({ extinfo: "extinfo" })
import flatiron from '../../hooks/flatiron'
const fi = flatiron([{
  id: "fallid",
  obj: "_Fall",
  service: "fall"
}, {
  id: "mandantid",
  obj: "_Mandant",
  service: "kontakt"
}])

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [handleExtinfo, fi],
    update: [handleExtinfo, fi],
    patch: [flatiron],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtinfo, fi],
    get: [handleExtinfo, fi],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
