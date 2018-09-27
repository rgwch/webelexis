/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'fall';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id').primary();
        table.string('patientid');
        table.string('garantid');
        table.string('kostentrid');
        table.string('versnummer')
        table.string('fallnummer')
        table.string('betriebsnummer')
        table.string('diagnosen')
        table.string('datumvon')
        table.string('datumbis')
        table.string('bezeichnung')
        table.string('grund')
        table.string('gesetz')
        table.binary('extinfo')
        table.string('status')
        table.string('deleted')
        table.bigint('lastupdate')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });
  

  return db;
};
