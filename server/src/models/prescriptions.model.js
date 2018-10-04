/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */

// prescriptions-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
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
        table.string('deleted',1)
        table.integer('LASTUPDATE')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
