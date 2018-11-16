const { authenticate } = require('@feathersjs/authentication').hooks;

const adapter=ctx=>{
  const type=ctx.data.type
  const adaptername=`./${type}_adapter`
  const adapter=require(adaptername)
  const billing=adapter.createBilling(ctx.data)
  ctx.data=billing
  return ctx
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
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
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
