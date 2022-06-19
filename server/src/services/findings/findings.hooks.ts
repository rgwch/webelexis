const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');
import { v4 as uuid } from 'uuid'

const ensureID = ctx => {
  if (!ctx.id) {
    ctx.id = uuid();
  }
  return ctx
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [ensureID],
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
    update: [ensureID],
    patch: [],
    remove: []
  }
};
