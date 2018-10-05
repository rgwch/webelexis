/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');
const ElexisUtils = require('../../util/elexis-types')
const util = new ElexisUtils()


const fetchExtInfo=context=>{
  if(context.result && context.result.data){
    for(const fall of context.result.data){
      const exti=fall.EXTINFO
      const json=util.getExtInfo(exti)
      fall.extinfo=json
    }
    return context
  }
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [treatDeleted()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [fetchExtInfo],
    get: [],
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
