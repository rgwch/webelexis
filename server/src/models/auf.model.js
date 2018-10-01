/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
/* eslint-disable no-console */

// auf-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'auf';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable()
        table.string('patientid')
        table.string('fallid')
        table.string('prozent')
        table.string('datumvon')
        table.string('datumbis')
        table.string('Grund')
        table.string('AUFZusatz')
        table.string('BriefID')
        table.string('DatumAUZ')
        table.string('deleted')
        table.integer('LASTUPDATE')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
