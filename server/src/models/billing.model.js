/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const {logger} = require("../logger")

module.exports = function(app) {
  const db = app.get("knexClient")
  const tableName = "leistungen"
  const buyprices = "ek_preise"
  const sellprices = "vk_preise"
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema
        .createTable(tableName, table => {
          table
            .string("id", 40)
            .primary()
            .unique()
            .notNullable()
          table.string("deleted", 1)
          table.bigint("lastupdate")
          table.string("behandlung", 40)
          table.string("leistg_txt")
          table.string("leistg_code", 40)
          table.string("klasse", 80)
          table.string("zahl", 3)
          table.string("ek_kosten", 6)
          table.string("vk_tp", 8)
          table.string("vk_scale", 8)
          table.string("vk_preis", 6)
          table.string("scale", 4)
          table.string("scale2", 4)
          table.string("userid", 40)
          table.binary("detail")
        })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e))
    }
  })

  db.schema.hasTable(buyprices).then(has => {
    if (!has) {
      db.schema
        .createTable(buyprices, table => {
          table.string("typ", 80)
          table.string("id", 40)
          table.string("datum_von", 8)
          table.string("datum_bis", 8)
          table.string("multiplikator", 8)
          table.bigint("lastupdate")
          table.string("deleted", 1)
        })
        .then(() => logger.info(`Created ${buyprices} table`))
        .catch(e => logger.error(`Error creating ${buyprices} table`, e))
    }
  })

  db.schema.hasTable(sellprices).then(has => {
    if (!has) {
      db.schema
        .createTable(sellprices, table => {
          table.string("typ", 80)
          table.string("id", 40)
          table.string("datum_von", 8)
          table.string("datum_bis", 8)
          table.string("multiplikator", 8)
          table.bigint("lastupdate")
          table.string("deleted", 1)
        })
        .then(() => logger.info(`Created ${sellprices} table`))
        .catch(e => logger.error(`Error creating ${sellprices} table`, e))
    }
  })

  return db
}
