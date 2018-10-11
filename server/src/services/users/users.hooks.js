/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');
const handleExtInfo=require('../../hooks/handle-extinfo')


const addContact = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const s = context.app.service('kontakt')
    let k = await s.get(context.result.KONTAKT_ID, context.params)
    if(k){
      context.result.kontakt = k
    }
    return context;
  };
};

module.exports = {
  before: {
    all: [],
    find: [treatDeleted()],
    get: [/* authenticate('jwt') */],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [addContact(), handleExtInfo({extinfo: "EXTINFO"})],
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
