/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'artikelstamm_ch';
  const fields=["deleted","TYPE","BB","CUMM_VERSION","GTIN","PHAR",
    "DSCR","ADDDSCR","ATC","COMP_GLN","COMP_NAME","PEXF","PPUB",
    "PKG_SIZE","SL_ENTRY","IKSCAT","LIMITATION","LIMITATION_PTS",
    "LIMITATION_TXT","GENERIC_TYPE","HAS_GENERIC","LPPV","DEDUCTBLE",
    "NARCOTIC","NARCOTIC_CAS","VACCINE","LieferantID","Maxbestand",
    "Minbestand","Istbestand","Verkaufseinheit","Anbruch","PRODNO"]
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary();
        table.bigint('lastupdate')
        fields.forEach(field=>table.string(field))
        table.binary("ExtInfo")
      })
        .then(() => console.log(`Created ${tableName} table`))
        .catch(e => console.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
