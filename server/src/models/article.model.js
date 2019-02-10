/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')


module.exports = function (app) {
  const db = app.get('knexClient');
  const tableName = 'artikelstamm_ch';
  const legacyName = 'artikel';

  db.schema.hasTable(tableName).then(exists => {
    if(!exists) {
      db.schema.createTable(tableName, table => {
        table.string('id',40).primary();
        table.string('deleted',1)
        table.bigint('lastupdate')
        table.string("type",1)          // 3,N,P,X
        table.string("bb",1)            // Blackbox 0,2,9
        table.string("cumm_version",4)
        table.string("gtin",14)         // EAN  -> oddb_product.xml
        table.string("phar",7)          // Pharmacode
        table.string("dscr",100)        // Title (DSCRD or DSCRF) -> oddb_product.xml
        table.string("adddscr",50)      // Sort title -> oddb_article.xml
        table.string("atc",10)          // ATC Code -> oddb_product.xml
        table.string("comp_gln",13)     // manufacturers EAN
        table.string("comp_name")       // manufacturer
        table.string("pexf",10)         // Ex Factory price -> oddb_article.xml
        table.string("ppub",10)         // selling price  -> oddb_article.xml
        table.string("pkg_size",6)      // package size -> oddb_product.xml
        table.string("sl_entry",1)      // Is in "Spezialitätenliste"?
        table.string("ikscat",1)        // Category  (A,B,C,D,E, or Null)
        table.string("limitation",1)    // has limitations?
        table.string("limitation_txt")  // Text of limitation
        table.string("generic_type",1)  // Is generic/generic original?
        table.string("has_generic",1)   // A generic exists
        table.string("lppv",1)          // Special use medicament, not paid by insurance
        table.string("deductible",6)    // Null, 10,20 (% KVG share) -> oddb_article.xml
        table.string("narcotic",1)      // Is narcotic substance? (BTMG) -> oddb_article.xml
        table.string("narcotic_cas")
        table.string("vaccine",1)       // Is vaccine?
        table.string("lieferantid",40)  // distributor
        table.string("maxbestand",4)    // Max number in local store
        table.string("minbestand",4)    // order threshhold in store
        table.string("istbestand",4)    // currently in store
        table.string("verkaufseinheit",4) // Number of items per package
        table.string("anbruch",4)       // parts of packages in store
        table.string("prodno",10)       // -> oddb_product.xml
        table.string("substance")       // -> oddb_product.xml
        table.binary("extinfo")
      })
        .then(() => logger.info(`Created ${tableName} table`))
        .catch(e => logger.error(`Error creating ${tableName} table`, e));
    }
  });

  db.schema.hasTable(legacyName).then(exists=>{
    if(!exists){
      db.schema.createTable(legacyName,table=>{
        table.string("id",40).primary()
        table.string("subid",20)
        table.string("lieferantid",40)
        table.string("name")
        table.string("name_intern")
        table.string("maxbestand",4)
        table.string("minbestand",4)
        table.string("istbestand",4)
        table.string("ek_preis",8)
        table.string("vk_preis",8)
        table.string("typ",15)
        table.string("codeclass",10)
        table.string("extid",40)
        table.binary("extinfo")
        table.string("klasse",80)
        table.string("deleted",1)
        table.string("ean",15)
        table.bigint("lastupdate")
        table.string("validfrom",8)
        table.string("validto",8)
        table.string("atc_code")
      })
      .then(() => logger.info(`Created ${legacyName} table`))
      .catch(e => logger.error(`Error creating ${legacyName} table`, e));

    }
  })

  return db;
};
