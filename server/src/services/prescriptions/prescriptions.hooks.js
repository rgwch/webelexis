/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const { DateTime } = require('luxon')
const handleExtinfo = require('../../hooks/handle-extinfo')({ extinfo: "ExtInfo" })
const flatiron = require('../../hooks/flatiron')([{
  id: "REZEPTID",
  obj: "_Rezept",
  service: "rezepte"
}])

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
    // ctx.params.query.DateFrom = { $lte: now }
    ctx.params.query.$or = [{ DateFrom: null }, { DateFrom: { $lte: now } }]
    ctx.params.query.$sort = {
      prescDate: -1
    }
    // ctx.params.query.$or = [{ DateUntil: { $gte: now } }, { DateUntil: null }]
  }
  return ctx
}

const doAddArticle = async (ctx, art) => {
  const artid = art.Artikel
  const rpid = art.REZEPTID
  try {
    if (artid) {
      art._Artikel = await ctx.articleService.get(artid)
    } else {
      art._Artikel = await ctx.articleService.get(art.artikelid)
    }
  } catch (err) {
    art._Artikel = { DSCR: "doAddArticle: nicht gefunden" }
  }
  return art
}

const getArticle = async ctx => {
  ctx.articleService = ctx.app.service('meta-article')
  ctx.result = await doAddArticle(ctx, ctx.result)
  return ctx
}
const findArticle = async ctx => {
  ctx.articleService = ctx.app.service('meta-article')
  if (ctx.result && ctx.result.data) {
    for (const art of ctx.result.data) {
      await doAddArticle(ctx, art)
    }
  }
  return ctx
}

const do_createCheck = obj => {
  delete obj._Artikel
  delete obj._Rezept
  if (obj.DateUntil == "null") {
    obj.DateUntil = null
  }
  return obj
}

/**
 * Before create and update: Remove _Artikel and _Rezept
 * @param {*} ctx
 */
const createcheck = ctx => {
  if (Array.isArray(ctx.data)) {
    for (const dat of ctx.data) {
      do_createCheck(dat)
    }
  } else {
    ctx.data = do_createCheck(ctx.data)
  }
  return ctx
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [current],
    get: [],
    create: [createcheck, handleExtinfo, flatiron],
    update: [createcheck, handleExtinfo, flatiron],
    patch: [flatiron],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtinfo, findArticle,flatiron],
    get: [getArticle, handleExtinfo,flatiron],
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
