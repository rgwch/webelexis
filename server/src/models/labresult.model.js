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
        table.string('id').primary().unique().notNullable()
        table.string('patientid')
        table.string('datum')
        table.string('itemid')
        table.string('resultat')
        table.text('kommentar')
        table.string('flags')
        table.string('deleted')
        table.string('Origin')
        table.string('Zeit')
        table.integer("LASTUPDATE")
        table.binary('ExtInfo')
        table.string('unit')
        table.string('analysetime')
        table.string('obervationtime')
        table.string('transmissiontime')
        table.string('refmale')
        table.string('reffemale')
        table.string('OriginID')
        table.string('pathodesc')
      }).then(() => logger.înfo(`Created ${resultTable} table`))
      .catch(e => logger.error(`Error creating ${resultTable} table`, e));
    }
  })
  db.schema.hasTable(itemsTable).then(exists=>{
    if(!exists){
      db.schema.createTable(itemsTable,table=>{
        table.string('id').primary().unique().notNullable()
        table.integer("LASTUPDATE")
        table.string('deleted')
        table.string('laborid')
        table.string('RefMann')
        table.string('RefFrauOrTx')
        table.string('Einheit')
        table.string('typ')
        table.string('gruppe')
        table.string('prio')
        table.string('billingcode')
        table.string('EXPORT')
        table.string('loinccode')
        table.string('visible')
        table.string('digits')
        table.string('formula')
      }).then(() => logger.info(`Created ${itemsTable} table`))
      .catch(e => logger.error(`Error creating ${itemsTable} table`, e));
    }
  })
 }
