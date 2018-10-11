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
        table.string('id',40).primary().unique().notNullable();
        table.string('fallid',40);
        table.string('mandantid',40)
        table.string('rechnungsid',40)
        table.string('datum',8)
        table.string('diagnosen')
        table.string('leistungen')
        table.binary('eintrag')
        table.string('deleted',1).defaultTo('0')
        table.integer('LASTUPDATE')
        table.string('Zeit',8)

      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
