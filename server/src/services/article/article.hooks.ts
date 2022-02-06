/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import filters  from './article_filters'
const filter = filters({ blackbox: true, generics: false })
const handleExtinfo = require('../../hooks/handle-extinfo')({extinfo: "extinfo"})

const scopes = {
  "ch.artikelstamm.elexis.common.ArtikelstammItem": "artikelstamm_ch",
  "ch.elexis.medikamente.bag.data.BAGMedi": "artikel",
  "ch.elexis.artikel_ch.data.Medikament": "artikel",
  "ch.elexis.data.Artikel": "artikel"
}
/**
 * Get article by scoped ID. A Scoped ID is an elexis type of ID, denoted with class::id, e.g.
 *  'ch.artikelstamm.elexis.common.ArtikelStammItem::0000wqwqe88070'

 */
const fromScopedId = async ctx => {
  const [scope, id] = ctx.id.split("::")
  if (id) {
    ctx.id = id
  }
  return ctx
}

export default {
  before: {
    all: [],
    find: [],
    get: [fromScopedId],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [handleExtinfo],
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
