/* eslint-disable no-console */

// leistungsblock-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'leistungsblock';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('mandantid',40);
        table.string('name',30)
        table.binary('leistungen')
        table.string('deleted',1)
        table.integer('LASTUPDATE')
        table.string('Macro',30)
        table.string('codeelements')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
