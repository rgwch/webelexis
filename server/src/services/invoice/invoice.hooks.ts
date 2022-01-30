const { authenticate } = require('@feathersjs/authentication').hooks;
import { createBill } from './generator'

const create = async ctx => {
  const result = await createBill(ctx.data)
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
