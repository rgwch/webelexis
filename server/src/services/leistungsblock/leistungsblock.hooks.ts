const { authenticate } = require('@feathersjs/authentication').hooks;
import handleZipped from '../../hooks/handle-zipped'

const process = lb => {
  lb.type = "block"
  const elements = lb.codeelements
  if (elements) {
    const leistungen = elements.split(/:=:/)
    const ret = []
    for (const l of leistungen) {
      const [system, code, text] = l.split(/\s*\|\s*/)
      ret.push({ system: system.toLowerCase(), code, text })
    }
    lb.billables = ret
    delete lb.codeelements
  }
  if (lb.elemente) {
    const leistungen = lb.elemente.split(",")
    const ret = []
    for (const l of leistungen) {
      const [system, code] = l.split("::")
      ret.push({ system, code: code.split(/-/)[0] })
    }
    lb.elemente = ret;
    delete lb.leistungen
  }
}


const getElements = ctx => {
  if (ctx.result) {
    if (ctx.result.data && Array.isArray(ctx.result.data)) {
      for (const r of ctx.result.data) {
        process(r)
      }
    } else {
      process(ctx.result)
    }
  }
  return ctx
}

export default {
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
    find: [handleZipped('leistungen', 'elemente'), getElements],
    get: [handleZipped('leistungen', 'elemente'), getElements],
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
