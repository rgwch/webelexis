const { authenticate } = require('@feathersjs/authentication').hooks

const metaqueries = async (ctx) => {
  const knex = ctx.app.get('knexClient')
  const query = ctx.params.query
  if (query?.konsid) {
    const result=await knex('behdl_dg_joint')
      .join('diagnosen', 'diagnoseid', '=', 'diagnosen.id')
      .where('behdl_dg_joint.deleted', '0')
      .andWhere('diagnosen.deleted', '0')
      .andWhere('behandlungsid', query.konsid)
    ctx.result = {
      total: result.length,
      data: result,
      skip: 0,
      limit: 0
    }
    return ctx
  }
}
export default {
  before: {
    all: [authenticate('jwt')],
    find: [metaqueries],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
