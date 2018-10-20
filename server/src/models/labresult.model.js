/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 const logger=require('../logger')

 module.exports=function(app){
  const db=app.get('knexClient')
  const resultTable="laborwerte"
  const itemsTable="laboritems"
  db.schema.hasTable(resultTable).then(exists=>{
    if(!exists){
      db.schema.createTable(resultTable, table=>{
        table.string('id',40).primary().unique().notNullable()
        table.string('patientid',40)
        table.string('datum',8)
        table.string('itemid',40)
        table.string('resultat')
        table.text('kommentar')
        table.string('flags',10)
        table.string('deleted',1).defaultTo('0')
        table.string('Origin',40)
        table.string('Zeit',6)
        table.integer("LASTUPDATE")
        table.binary('ExtInfo')
        table.string('unit')
        table.string('analysetime',24)
        table.string('obervationtime',24)
        table.string('transmissiontime',24)
        table.string('refmale')
        table.string('reffemale')
        table.string('OriginID',40)
        table.string('pathodesc',128)
      })
      .then(() => logger.înfo(`Created ${resultTable} table`))
      .catch(e => logger.error(`Error creating ${resultTable} table`, e));
    }
  })
  db.schema.hasTable(itemsTable).then(exists=>{
    if(!exists){
      db.schema.createTable(itemsTable,table=>{
        table.string('id',40).primary().unique().notNullable()
        table.integer("LASTUPDATE")
        table.string('deleted',1)
        table.string('laborid',40)
        table.string('RefMann')
        table.string('RefFrauOrTx')
        table.string('Einheit',20)
        table.string('typ',1)
        table.string('gruppe',25)
        table.string('prio',3)
        table.string('billingcode',128)
        table.string('EXPORT',100)
        table.string('loinccode',128)
        table.string('visible',1)
        table.string('digits',16)
        table.string('formula')
      })
      .then(() => logger.info(`Created ${itemsTable} table`))
      .catch(e => logger.error(`Error creating ${itemsTable} table`, e));
    }
  })
  return db;
 }
