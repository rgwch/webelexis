const { authenticate } = require('@feathersjs/authentication').hooks;
const handleZipped = require('../../hooks/handle-zipped')
const Samdas = require('@rgwch/samdastools')

const check = ctx => {
  console.log(ctx.params)
  return ctx
}

const handleSamdas = async ctx => {
  ctx.result.data[0].html=await Samdas.toHtml(ctx.result.data[0].text)
  return ctx
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [],
    update: [],
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
