/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')
const agendacfg = require('../../config/elexisdefaults').agenda


module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'agntermine';
  db.schema.hasTable(tableName).then(exists => {
    if (!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id', 127).primary().unique().notNullable()
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
        table.integer('lastupdate')
        table.text('StatusHistory')
        table.string('priority', 1)
        table.string('caseType', 1)
        table.string('insuranceType', 1)
        table.string('treatmentReason', 1)
      })
        .then(() => {
          logger.info(`Created ${tableName} table`)
          const config = app.service("elexis-config")
          //const agendacfg = app.get("defaults")["agenda"] || { "resources": ["Arzt"] }
          config.create({
            param: "agenda/bereiche",
            wert: agendacfg.resources.join()
          })
          for (const rsc of agendacfg.resources) {
            config.create({
              "param": `agenda/tagesvorgaben/${rsc}`,
              "wert": agendacfg.daydefaults
            })
          }
        })
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
