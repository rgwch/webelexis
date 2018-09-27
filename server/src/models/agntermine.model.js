/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'agntermine';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id').primary().unique().notNullable()
        table.string('PatID')
        table.string('Bereich')
        table.string('Tag')
        table.string('Beginn')
        table.string('Dauer')
        table.string('TerminTyp')
        table.string('TerminStatus')
        table.string('ErstelltVon')
        table.string('angelegt')
        table.string('lastedit')
        table.integer('flags')
        table.string('deleted')
        table.string("Extension")
        table.string('linkgroup')
        table.integer('lastupdate')
        table.string('StatusHistory')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
