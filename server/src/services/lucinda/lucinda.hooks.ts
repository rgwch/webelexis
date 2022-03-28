const { authenticate } = require('@feathersjs/authentication').hooks
const errors = require('@feathersjs/errors')
import { logger } from '../../logger'

const errhandler = (ctx) => {
  if (ctx.error) {
    logger.error(ctx.error)
    const newError = new errors.GeneralError('server error')
    ctx.error = newError
    return ctx
  }
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [errhandler],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
