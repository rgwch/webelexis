/* eslint-disable no-console */

// tarmed-model.js - A KnexJS
//
// See http://knexjs.org/
// for more of what you can do here.
module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'tarmed';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string("deleted",1)
        table.integer("lastupdate")
        table.string('Parent',32)
        table.string('DigniQuali',4)
        table.string('DigniQuanti',5)
        table.string('Sparte',4)
        table.string('GueltigVon',8)
        table.string('GueltigBis',8)
        table.string('Nickname',25)
        table.string('tx255')
        table.string('code',25)
        table.string('Law',3)
        table.string('ischapter',1)
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
