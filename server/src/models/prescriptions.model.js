/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */
const logger = require('../logger')

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'rezepte';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable()
        table.string('patientid',40)
        table.string('mandantid',40)
        table.string('datum',8)
        table.text('rptxt')
        table.string('RpZusatz')
        table.string('BriefID',40)
        table.string('deleted',1).defaultTo('0')
        table.integer('LASTUPDATE')
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
