/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const { DateTime } = require('luxon')
const uuid = require('uuid/v4')

const typemap={
  "ch.elexis.data.TarmedLeistung":"tarmed",
  "ch.artikelstamm.elexis.common.ArtikelstammItem":"article"
}

/**
 * Create a Billing from a Billable
 * @param {*} ctx
 */
const adapter = async ctx => {
  const type = typemap[ctx.data.codesystem]
  const adaptername = `./${type}-adapter`
  const adapter = require(adaptername)
  const billing = await adapter.createBilling(ctx.data, ctx.app)
  billing.behandlung = ctx.data.encounter_id
  const encounterService = ctx.app.service('konsultation')
  const encounter = await encounterService.get(ctx.data.encounter_id)
  const caseService = ctx.app.service('fall')
  const fall = await caseService.get(encounter.fallid)
  let billingsystem = fall.extjson ? fall.extjson.billing : undefined
  if (!billingsystem) {
    billingsystem = fall.gesetz
    if (!billingsystem) {
      billingsystem = "KVG"
    }
  }
  const now = DateTime.local().toFormat("yyyyLLdd")
  const knex = ctx.app.get('knexClient')
  let mul = await knex('vk_preise').select('multiplikator')
    .where('typ', billingsystem)
    .andWhere('datum_von', '<=', now)
    .andWhere('datum_bis', '>=', now)
  if (!mul || mul.length < 1) {
    mul = [{ multiplikator: "1.0" }]
  }
  billing.vk_scale = mul[0].multiplikator
  const tp=parseFloat(billing.vk_tp)
  const scale=parseFloat(billing.vk_scale)
  billing.vk_preis = Math.round(tp*scale)
  billing.id=uuid()
  billing.lastupdate=new Date().getTime()
  billing.deleted="0"
  ctx.data = billing
  return ctx
}

const check=ctx=>{
  if(ctx.data){
    console.log(ctx.data)
  }
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [check],
    get: [],
    create: [adapter],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [check],
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
