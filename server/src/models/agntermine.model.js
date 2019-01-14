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
        table.string('PatID', 80)
        table.string('Bereich', 40)
        table.string('Tag', 8)
        table.string('Beginn', 4)
        table.string('Dauer', 4)
        table.text('Grund')
        table.string('TerminTyp')
        table.string('TerminStatus')
        table.string('ErstelltVon')
        table.string('angelegt', 10)
        table.string('lastedit', 10)
        table.string('flags', 10)
        table.string('deleted', 1)
        table.text("Extension")
        table.string('linkgroup')
        table.bigint('lastupdate')
        table.text('StatusHistory')
        table.string('priority', 1)
        table.string('caseType', 1)
        table.string('insuranceType', 1)
        table.string('treatmentReason', 1)
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
