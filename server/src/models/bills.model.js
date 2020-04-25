/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/* eslint-disable no-console */

// bills-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'rechnungen';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('deleted',1);
        table.bigint("lastupdate")
        table.string('rnnummer',8)
        table.string('mandantid',40)
        table.string('rndatum',8)
        table.string('rnstatus',20)
        table.string('rndatumvon',8)
        table.string('rndatumbis',8)
        table.string('betrag',8)
        table.string('statusdatum',8)
        table.binary('extinfo')

      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });

  return db;
};
