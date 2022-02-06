import { config } from '../../configuration'
const { authenticate } = require('@feathersjs/authentication').hooks;
import { outputInvoice } from './generator'

const create = async ctx => {
  if (config.billing.stickerForMail) {
    const stickerService = ctx.app.service("stickers")
    const stickers = await stickerService.find({ query: { forPatient: ctx.data.fall.patient.id } })
    if (stickers.length > 0) {
      if (stickers.find(st => st.name == config.billing.stickerForMail)) {
        ctx.data.toMail = ctx.data.fall.patient.email
      }
    }
  }
  const result = await outputInvoice(ctx.data)
  ctx.result = true
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
