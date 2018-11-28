/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtinfo=require('../../hooks/handle-extinfo')
const {DateTime}=require('luxon')

const current=async ctx=>{
  if(ctx.params.query && ctx.params.query.current){
    const now=DateTime.local().toFormat('yyyyLLddHHmmss')
    ctx.params.query.patientid=ctx.params.query.current
    delete ctx.params.query.current
    ctx.params.query.DateFrom={$lte:now}
    ctx.params.query.$or=[{DateUntil:{$gte:now}},{DateUntil: null}]
  }
  return ctx
}
module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [current],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtinfo({extinfo:"ExtInfo"})],
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
