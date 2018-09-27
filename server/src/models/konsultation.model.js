/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'behandlungen';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id').primary().unique().notNullable();
        table.string('fallid');
        table.string('mandantid')
        table.string('rechnungsid')
        table.string('datum')
        table.string('diagnosen')
        table.string('leistungen')
        table.binary('eintrag')
        table.string('deleted')
        table.integer('LASTUPDATE')
        table.string('Zeit')

      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
