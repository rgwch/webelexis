const findpos = async ctx => {
  if (ctx.params.query && ctx.params.query.$find) {
    const expr = ctx.params.query.$find
    ctx.params.query.tx255 = { $like: expr + "%" }
    if (ctx.params.query.$enctr) {
      const enct = ctx.params.query.$enctr
      ctx.params.query.gueltigvon = { $lte: enct.datum }
      ctx.params.query.gueltigbis = { $gte: enct.datum }
      ctx.params.query.$or = [{Law: "KVG"}, {Law: "UVG"}]
      delete ctx.params.query.$enctr
    }
    delete ctx.params.query.$find
  }
  return ctx
}

module.exports = {
  before: {
    all: [],
    find: [findpos],
    get: [],
    create: [],
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
