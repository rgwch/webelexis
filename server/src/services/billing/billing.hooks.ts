/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

// Elexis "Leistungen" bzw. "Verrechnet"
const { authenticate } = require('@feathersjs/authentication').hooks;
import { DateTime } from 'luxon'
import { logger } from '../../logger'
import { v4 as uuid } from 'uuid'

const typemap = {
  "ch.elexis.data.TarmedLeistung": "tarmed",
  "ch.artikelstamm.elexis.common.ArtikelstammItem": "article"
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
  const tp = parseFloat(billing.vk_tp)
  const scale = parseFloat(billing.vk_scale)
  billing.vk_preis = Math.round(tp * scale)
  billing.id = uuid()
  billing.lastupdate = new Date().getTime()
  billing.deleted = "0"
  ctx.data = billing
  return ctx
}

const check = ctx => {
  if (ctx.data) {
    logger.debug(ctx.data)
  }
}

const errHandler=async ctx=>{
  console.log(JSON.stringify(ctx))
}
export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [adapter],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [errHandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
