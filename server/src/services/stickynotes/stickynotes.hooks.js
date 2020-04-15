const { authenticate } = require('@feathersjs/authentication').hooks;
const handleZipped = require('../../hooks/handle-zipped')
const Samdas = require('@rgwch/samdastools')
const { deflate } = require('zlib')
const { promisify } = require('util')
const zip = promisify(deflate)

const check = ctx => {
  console.log(ctx.params)
  return ctx
}

const handleSamdas = async ctx => {
  if (ctx.method === 'find') {
    if (ctx.result && ctx.result.data && ctx.result.data.length && ctx.result.data[0].contents) {
      ctx.result.data[0].delta = await Samdas.zippedToDelta(ctx.result.data[0].contents)
      delete ctx.result.data[0].contents
    }
    return ctx
  } else if (ctx.method === 'create' || ctx.method === 'update') {
    if (ctx.data && ctx.data.delta) {
      ctx.data.contents = await Samdas.zippedFromDelta(ctx.data.delta)
      delete ctx.data.delta
    }
    return ctx
  }
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [handleSamdas],
    update: [handleSamdas],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [handleSamdas],
    get: [handleSamdas],
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
