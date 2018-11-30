const oddbimport=require('../../util/load-oddb')


const update_articles=async ctx=>{
    const importer=new oddbimport(ctx.app)
    const file=ctx.id
    const result=await importer.importFromZip(file)
    ctx.result={}
    return ctx
}
module.exports = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [update_articles],
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
