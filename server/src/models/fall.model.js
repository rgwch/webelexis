/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'faelle';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('patientid',40);
        table.string('garantid',40);
        table.string('kostentrid',40);
        table.string('versnummer',50)
        table.string('fallnummer',50)
        table.string('betriebsnummer',50)
        table.string('diagnosen')
        table.string('datumvon',8)
        table.string('datumbis',8)
        table.string('bezeichnung',30)
        table.string('grund')
        table.string('gesetz',20)
        table.binary('EXTINFO')
        table.string('status')
        table.string('deleted',1)
        table.bigint('LASTUPDATE')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
