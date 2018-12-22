/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtinfo = require('../../hooks/handle-extinfo')
const { DateTime } = require('luxon')
const flatten=require('../../hooks/flatten')

/**
 * find the current medication of the given patient (if search parameter current is given and is an id
 * of a patient)
 *
 * @param {} ctx
 */
const current = ctx => {
  if (ctx.params.query && ctx.params.query.current) {
    const now = DateTime.local().toFormat('yyyyLLddHHmmss')
    ctx.params.query.patientid = ctx.params.query.current
    delete ctx.params.query.current
    ctx.params.query.DateFrom = { $lte: now }
    ctx.params.query.$sort = {
      prescDate: -1
    }
    // ctx.params.query.$or = [{ DateUntil: { $gte: now } }, { DateUntil: null }]
  }
  return ctx
}



const doAddArticle = async (ctx,art) => {
  const artid = art.Artikel
  const rpid=art.REZEPTID
  try {
    if (artid) {
      art.Artikel = await ctx.articleService.get(artid)
    } else {
      art.Artikel = await ctx.articleService.get(art.artikelid)
    }
  } catch (err) {
    art.Artikel = { DSCR: "doAddArticle: nicht gefunden" }
  }
  try{
    if(rpid){
      art.REZEPTID=await ctx.app.service('rezepte').get(art.REZEPTID)
    }
  } catch(err){
    art.REZEPTID = null
  }
  return art
}

const addArticle = async ctx => {
  ctx.articleService = ctx.app.service('meta-article')
  if (ctx.method === 'get') {
    ctx.result = await doAddArticle(ctx,ctx.result)
  } else {
    for (const art of ctx.result.data) {
      await doAddArticle(ctx,art)
    }
  }
  return ctx
}
const createcheck = ctx => {
  if (ctx.params.DateUntil == "null") {
    ctx.params.DateUntil = null
  }
  if(ctx.params.Artikel && ctx.params.Artikel.id){
    
  }
  return ctx
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [current],
    get: [],
    create: [createcheck,flatten(['Artikel','REZEPTID'])],
    update: [flatten(['Artikel','REZEPTID'])],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtinfo({ extinfo: "ExtInfo" }), addArticle],
    get: [addArticle, handleExtinfo({extinfo: "ExtInfo"})],
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
