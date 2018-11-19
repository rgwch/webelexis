const logger=require('../logger')

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
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
