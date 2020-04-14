const { authenticate } = require('@feathersjs/authentication').hooks;
const handleZipped = require('../../hooks/handle-zipped')
const Samdas = require('@rgwch/samdastools')

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
    ctx.data.text=await Samdas.fromDelta(ctx.data.delta)
    delete ctx.data.delta
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
