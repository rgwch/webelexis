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
    ctx.result.data[0].delta = await Samdas.toDelta(ctx.result.data[0].text)
    delete ctx.result.data[0].text
    delete ctx.result.data[0].contents
    return ctx
  } else if (ctx.method === 'create' || ctx.method === 'update') {
    const samdas = await Samdas.fromDelta(ctx.data.delta)
    delete ctx.data.delta
    const zipped = await zip(samdas)
    const up=Buffer.allocUnsafe(zipped.length+4)
    zipped.copy(up,4,0)
    ctx.contents = zipped
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
    find: [handleZipped('contents', 'text'), handleSamdas],
    get: [handleZipped('contents', 'text'), handleSamdas],
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
