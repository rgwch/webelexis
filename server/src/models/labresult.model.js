/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 module.exports=function(app){
  const db=app.get('knexClient')
  const resultTable="laborwerte"
  db.schema.hasTable(resultTable).then(exists=>{
    if(!exists){
      db.schema.createTable(resultTable, table=>{
        table.string('id').primary().unique().notNullable()
        table.string('patientid')
        table.string('datum')
        table.string('itemid')
      })
    }
  })
 }
