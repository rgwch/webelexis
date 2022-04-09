/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { config } from '../../configuration'
const { authenticate } = require('@feathersjs/authentication').hooks;
import { outputInvoice } from './generator'

/**
 * Create a bill and print or mail it
 * @param ctx
 * @returns
 */
const create = async ctx => {
  if (config.billing.stickerForMail) {
    const stickerService = ctx.app.service("stickers")
    const stickers = await stickerService.find({ query: { forPatient: ctx.data._Fall._Patient.id } })
    if (stickers.length > 0) {
      if (stickers.find(st => st.name == config.billing.stickerForMail)) {
        ctx.data.toMail = ctx.data.fall.patient.email
      }
    }
  }
  ctx.result = await outputInvoice(ctx.data)
  if (ctx.result) { }
  return ctx
}
export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [create],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
