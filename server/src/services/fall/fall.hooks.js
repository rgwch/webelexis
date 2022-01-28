/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');
const handleExtInfo = require('../../hooks/handle-extinfo')({ extinfo: "extinfo" });
const flatiron = require("../../hooks/flatiron")([{
  id: "patientid",
  obj: "patient",
  service: "kontakt"
}, {
  id: "garantid",
  obj: "garant",
  service: "kontakt"
}, {
  id: "kostentrid",
  obj: "kostentraeger",
  service: "kontakt"
}])

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [treatDeleted()],
    get: [],
    create: [handleExtInfo, flatiron],
    update: [handleExtInfo, flatiron],
    patch: [handleExtInfo, flatiron],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtInfo, flatiron],
    get: [handleExtInfo, flatiron],
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
