const { authenticate } = require('@feathersjs/authentication').hooks;

const metaqueries = async ctx => {
  const knex = ctx.app.get("knexClient")
  const query = ctx.params.query
  if (query?.konsid) {
    knex('behdl_dg_joint')
      .join('behandlungen', "behandlungsid", "=", "behandlungen.id")
      .where("behdl_dg_joint.deleted", "0")
      .andWhere("behandlungen.deleted", "0")
      .andWhere("behandlungsid", query.konsid)


  }

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
    find: [metaqueries],
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
