const { authenticate } = require('@feathersjs/authentication').hooks;
const handleZipped = require('../../hooks/handle-zipped')

const makeBillables = elements => {
  const ret = []
  const leistungen = elements.split(/:=:/)
  for (const l of leistungen) {
    const [system, code, text] = l.split(/\s*\|\s*/)
    ret.push({ system: system.toLowerCase(), code, text })
  }
  return ret;
}

const getElements = ctx => {
  if (ctx.result) {
    if(ctx.result.data && Array.isArray(ctx.result.data)){
      for(const r of ctx.result.data){
        r.billables=makeBillables(r.codeelements)
      }
    }else{
      ctx.result.billables = makeBillables(ctx.result.codeelements)
    }
  }
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
    find: [handleZipped('leistungen','elemente' ), getElements],
    get: [handleZipped('leistungen','elemente' ), getElements],
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
