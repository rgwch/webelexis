/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 * connection to the Elexis database is via knex (https://knexjs.org)
 * here we configure our knex instance. The client credentials are
 * configured in /config/*.json
 */

const knex = require('knex');
const logger=require('./logger')
const fs=require('fs')
const path=require('path')

module.exports = function (app) {
  // undocument exactly one of the following three lines
  const { client, connection } = app.get('mysql');
  // const { client, connection } = app.get('postgresql');
  // const {client,connection} = app.get("sqlite");
  const db = knex({ client,
      connection: app.get("userconfig").elexisdb || connection,
      pool: { max: 50 } });
  db('config').select('wert').where('param','webelexis').then(result=>{
    if(result && result.length>0){
      console.log("Found Webelexis Version %s",result[0].wert)
    }else{
      logger.warn("webelexis config entry not found")
      const script=fs.readFileSync('./modify_elexis.sql',"utf-8")
      const statements=script.split(";")
      const execs=[]
      for(const stm of statements){
        execs.push(db.raw(stm.replace(/[\n\r]/,"")).catch(err=>{
          logger.warn("statement failed: %s",err)
        }))
      }
      Promise.all(execs).then(res=>{
        const version=app.get('version')
        db('config').insert({param:'webelexis',wert:version}).then(r=>{
          logger.info("script finished")
        }).catch(err=>{
          logger.error("could not insert version %s",err)
        })
      })
     
    }
  }).catch(err=>{
    logger.error("Can't connect do database: %s ",err)
    process.exit(42)
  }) 
  app.set('knexClient', db);
};
