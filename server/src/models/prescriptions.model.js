/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */
const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const rpTableName = 'rezepte';
  const prescTableName = 'patient_artikel_joint'
  db.schema.hasTable(rpTableName).then(exists => {
    if (!exists) {
      db.schema.createTable(rpTableName, table => {
        table.string('id', 40).primary().unique().notNullable()
        table.string('patientid', 40)
        table.string('mandantid', 40)
        table.string('datum', 8)
        // table.text('rptxt')    not used
        table.string('rpzusatz',80)
        table.string('briefid', 40)
        table.string('deleted', 1)
        table.bigint('lastupdate')
      })
        .then(() => logger.info(`Created ${rpTableName} table`))
        .catch(e => logger.error(`Error creating ${rpTableName} table`, e));
    }
  });

  db.schema.hasTable(prescTableName).then(exists => {
    if (!exists) {
      db.schema.createTable(prescTableName, table => {
        table.string('id', 40).primary().unique().notNullable()
        table.string('deleted', 1)
        table.bigint('lastupdate')
        table.string('dosis')
        table.string('bemerkung')
        table.string('patientid', 40)
        table.string("rezeptid", 40)
        table.string('datefrom', 14)
        table.string('dateuntil', 14)
        table.string('anzahl', 3)
        table.binary('extinfo')
        table.string('artikelid',40)
        table.string('artikel')
        table.string('presctype', 2)  // 0: Fix, 1: reserve, 2: Recipe (ok, that's weird), 3 Self-Dispensed, 5 Symptomatic
        table.string('sortorder', 3)
        table.string('prescdate', 8)
        table.string('prescriptor', 40)
      })
        .then(() =>
        logger.info(`created ${prescTableName} table`))
        .catch(e =>
          logger.error(`Error creating ${prescTableName} table`.e))
    }
  })
  return db;
};
