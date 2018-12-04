/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtinfo=require('../../hooks/handle-extinfo')
const {DateTime}=require('luxon')

/**
 * find the current medication of the given patient (if search parameter current is given and is an id
 * of a patient)
 *
 * @param {} ctx
 */
const current=ctx=>{
  if(ctx.params.query && ctx.params.query.current){
    const now=DateTime.local().toFormat('yyyyLLddHHmmss')
    ctx.params.query.patientid=ctx.params.query.current
    delete ctx.params.query.current
    ctx.params.query.DateFrom={$lte:now}
    ctx.params.query.$or=[{DateUntil:{$gte:now}},{DateUntil: null}]
  }
  return ctx
}

const addArticle=async ctx=>{
  const articleService=ctx.app.service('article')
  for(const art of result.data){
    const artid=art.Artikel
    if(artid){
      art.Artikel=await articleService.get(artid)
    }
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
    find: [handleExtinfo({extinfo:"ExtInfo"}), addArticle],
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
