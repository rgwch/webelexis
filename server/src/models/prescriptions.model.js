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
        table.string('RpZusatz',80)
        table.string('BriefID', 40)
        table.string('deleted', 1)
        table.integer('LASTUPDATE')
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
        table.integer('LASTUPDATE')
        table.string('Dosis')
        table.string('Bemerkung')
        table.string('patientid', 40)
        table.string("REZEPTID", 40)
        table.string('DateFrom', 14)
        table.string('DateUntil', 14)
        table.String('ANZAHL', 3)
        table.binary('ExtInfo')
        table.string('artikelid',40)
        table.string('Artikel')
        table.string('prescType', 2)  // 0: Fix, 1: reserve, 2: Recipe (ok, that's weird), 3 Self-Dispensed, 5 Symptomatic
        table.string('sortOrder', 3)
        table.string('prescDate', 8)
        table.string('prescriptor', 40)
      })
        .then(() => logger.info(`created ${prescTableName} table`))
        .catch(e => logger.error(`Error creating ${prescTableName} table`.e))
    }
  })
  return db;
};
