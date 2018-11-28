/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const filters=require('./article_filters')
const filter=filters({blackbox:true,generics:false})

const scopes={
  "ch.artikelstamm.elexix.common.ArtikelstammItem":"artikelstamm_ch",
  "ch.elexis.medikamente.bag.data.BAGMedi": "artikel",
  "ch.elexis.artikel_ch.data.Medikament": "artikel",
  "ch.elexis.data.Artikel":"artikel"
}
/**
 * Find article by scoped ID. A Scoped ID is an elexis type of ID, denoted with class::id, e.g.
 *  'ch.artikelstamm.elexis.common.ArtikelStammItem::0000wqwqe88070'
 *
 */
const fromScopedId=ctx=>{
  if(ctx.params.query && ctx.params.query.scopedId){
    const [scope,id]=ctx.params.query.scopedId.split("::")
    const table=scopes.scope
  }
}
module.exports = {
  before: {
    all: [],
    find: [fromScopedId],
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
