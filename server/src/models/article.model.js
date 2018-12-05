/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')


module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'artikelstamm_ch';
  
  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary();
        table.string('deleted',1)
        table.bigint('lastupdate')
        table.string("TYPE",1)          // 3,N,P,X
        table.string("BB",1)            // Blackbox 0,2,9
        table.string("CUMM_VERSION",4)
        table.string("GTIN",14)         // EAN  -> oddb_product.xml
        table.string("PHAR",7)          // Pharmacode
        table.string("DSCR",100)        // Title (DSCRD or DSCRF) -> oddb_product.xml
        table.string("ADDDSCR",50)      // Sort title -> oddb_article.xml
        table.string("ATC",10)          // ATC Code -> oddb_product.xml
        table.string("COMP_GLN",13)     // manufacturers EAN
        table.string("COMP_NAME")       // manufacturer
        table.string("PEXF",10)         // Ex Factory price -> oddb_article.xml
        table.string("PPUP",10)         // selling price  -> oddb_article.xml
        table.string("PKG_SIZE",6)      // package size -> oddb_product.xml
        table.string("SL_ENTRY",1)      // Is in "Spezialitätenliste"?
        table.string("IKSCAT",1)        // Category  (A,B,C,D,E, or Null)
        table.string("LIMITATION",1)    // has limitations?
        table.string("LIMITATION_TXT")  // Text of limitation
        table.string("GENERIC_TYPE",1)  // Is generic/generic original?
        table.string("HAS_GENERIC",1)   // A generic exists
        table.string("LPPV",1)          // Special use medicament, not paid by insurance
        table.string("DEDUCTIBLE",6)    // Null, 10,20 (% KVG share) -> oddb_article.xml
        table.string("NARCOTIC",1)      // Is narcotic substance? (BTMG) -> oddb_article.xml
        table.string("NARCOTIC_CAS")
        table.string("VACCINE",1)       // Is vaccine?
        table.string("LieferantID",40)  // distributor
        table.string("Maxbestand",4)    // Max number in local store
        table.string("Minbestand",4)    // order threshhold in store
        table.string("Istbestand,4")    // currently in store
        table.string("Verkaufseinheit",4) // Number of irems per package
        table.string("Anbruch",4)       // parts of packages in store
        table.string("PRODNO",10)       // -> oddb_product.xml
        table.string("SUBSTANCE")       // -> oddb_product.xml
        table.binary("ExtInfo")
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });


  return db;
};
