/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');
const handleExtInfo = require('../../hooks/handle-extinfo')({ extinfo: "extinfo" });
import fi from "../../hooks/flatiron"
const flatiron = fi([{
  id: "patientid",
  obj: "_Patient",
  service: "kontakt"
}, {
  id: "garantid",
  obj: "_Garant",
  service: "kontakt"
}, {
  id: "kostentrid",
  obj: "_Kostentraeger",
  service: "kontakt"
}])

export default {
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
