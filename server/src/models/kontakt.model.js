/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'kontakt';
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary().unique().notNullable();
        table.string('istorganisation');
        table.string('istperson')
        table.string('istpatient')
        table.string('istanwender')
        table.string('istmandant')
        table.string('istlabor')
        table.string('land')
        table.string('geburtsdatum')
        table.string('geschlecht')
        table.string('Titel')
        table.string('Bezeichnung1').index()
        table.string('Bezeichnung2').index()
        table.string('Bezeichnung3')
        table.string('Strasse')
        table.string('plz')
        table.string('Ort')
        table.string("Telefon1")
        table.string('Telefon2')
        table.string('fax')
        table.string('NatelNr')
        table.string('Email')
        table.string('Website')
        table.string('gruppe')
        table.string('patientnr')
        table.string('anchrift')
        table.string('bemerkung')
        table.string('diagnosen')
        table.string('deleted')
        table.integer('LASTUPDATE')
        table.string('TitelSuffix')
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
