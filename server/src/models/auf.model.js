/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
/* eslint-disable no-console */

const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'auf';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable()
        table.string('patientid',40)
        table.string('fallid',40)
        table.string('prozent',3)
        table.string('datumvon',8)
        table.string('datumbis',8)
        table.string('Grund',50)
        table.string('AUFZusatz')
        table.string('BriefID',40)
        table.string('DatumAUZ',8)
        table.string('deleted',1).defaultTo('0')
        table.integer('LASTUPDATE')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
