const { authenticate } = require('@feathersjs/authentication').hooks;
const handleZipped = require('../../hooks/handle-zipped')
const Samdas = require('@rgwch/samdastools')
import  ziptool from '../../util/ziptool'

const check = ctx => {
  console.log(ctx.params)
  return ctx
}

const handleSamdas = async ctx => {
  if (ctx.method === 'find') {
    if (ctx.result && ctx.result.data && ctx.result.data.length && ctx.result.data[0].contents) {
      const unzipped=await ziptool.extract(ctx.result.data[0].contents, "Data")
      ctx.result.data[0].delta = await Samdas.toDelta(unzipped)
      delete ctx.result.data[0].contents
    }
    return ctx
  } else if (ctx.method === 'create' || ctx.method === 'update') {
    if (ctx.data && ctx.data.delta) {
      const samdas=await Samdas.fromDelta(ctx.data.delta)
      // const processed=samdas.replace(/\n\s*/g,'').replace(/>\s+</g,"><").replace(/></g,">\r\n<")+"\r\n"
      ctx.data.contents = ziptool.create("Data", samdas)
      delete ctx.data.delta
    }
    return ctx
  }
}
export default{
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
