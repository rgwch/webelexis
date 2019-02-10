/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')
const agendacfg = require('../../config/elexisdefaults').agenda


module.exports = async function (app) {
  const db = app.get('knexClient');
  const tableName = 'agntermine';
  const exists = await db.schema.hasTable(tableName)
  if (!exists) {
    try {
      await db.schema.createTable(tableName, table => {
        table.string('id', 127).primary().unique()
        table.string('patid', 80)
        table.string('bereich', 40)
        table.string('tag', 8)
        table.string('beginn', 4)
        table.string('dauer', 4)
        table.text('grund')
        table.string('termintyp')
        table.string('terminstatus')
        table.string('erstelltvon')
        table.string('angelegt', 10)
        table.string('lastedit', 10)
        table.string('flags', 10)
        table.string('deleted', 1)
        table.text("extension")
        table.string('linkgroup')
        table.bigint('lastupdate')
        table.text('statushistory')
        table.string('priority', 1)
        table.string('casetype', 1)
        table.string('insurancetype', 1)
        table.string('treatmentreason', 1)
      })
      logger.info(`Created ${tableName} table`)
      const config = app.service("elexis-config")
      //const agendacfg = app.get("defaults")["agenda"] || { "resources": ["Arzt"] }
      await config.create({
        param: "agenda/bereiche",
        wert: agendacfg.resources.join()
      })
      for (const rsc of agendacfg.resources) {
        await config.create({
          "param": `agenda/tagesvorgaben/${rsc}`,
          "wert": agendacfg.daydefaults
        })
      }
      logger.info("inserted agenda defaults")
    } catch (err) {
      logger.error(`Error creating ${tableName} table`, err);
    }
  }



  return db;
};
