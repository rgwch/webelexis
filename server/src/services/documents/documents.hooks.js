/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const fetch=require('node-fetch')
const logger = require('../../logger');
const fs=require('fs').promises
const path=require('path')
const getStream=require('get-stream')
const intoStream=require('into-stream')
const uuid = require('uuid/v4')



// logger.level="debug"

/**
 * When creating a document, some cases are recognized:
 * - If the contents-field is an URI, the file is indexed through solr/lucene and stored in the filesystem
 * - if the template field is not null, the contents is merged with the template. In that case,
 *   contents can be JSON or html. The resulting document is sent to solr and stored in the filesystem.
 * - if contents is not an URI and template is falsey, the data is simply sent to solr.
 * @param {} ctx
 */
const uri_regexp = /\w+:\/\/(\/?\/?)[^\s]+/
const handleCreate = async ctx => {
  if (ctx.data && ctx.data.contents) {
    if (uri_regexp.exec(ctx.data.contents)) {
      /* TIKA parser */
      const res=await fetch(ctx.data.contents)
      const addr=ctx.app.get('solr').tika
      if(!addr){
        log.error("solr.tika not defined in app configuration")
        throw new Error("Tika not found")
      }
      const cnt=getStream(res.body)
      const meta=await fetch(addr+"/meta",{headers: {accept: "application/json"}, method:"put", body: intoStream(cnt)})
      if(meta.status!=200){
        throw new Error(meta.statusText)
      }
      const text= await fetch(addr+"/tika",{headers: {accept: "text/plain"},method:"put",body:intoStream(cnt)})
      if(text.status!=200){
        throw new Error(result.statusText)
      }
      const json=await meta.json()
      json.contents=(await text.text()).trim()
      let storage=ctx.app.get('solr').filestore
      if(!storage){
        log.error("solr.filestore not defined in app onfiguration")
        throw new Error("Filestore not found")
      }
      if(!storage.startsWith("/")){
        storage=path.join(process.env.HOME,storage)
      }
      let fname=json.title
      if(fname){
        fname=encodeURIComponent(fname)
      }else{
        fname=uuid()
      }
      let filename=path.join(storage,(json.concern || "."),fname)
      const written= await fs.writeFile(filename,cnt)
      json.url="file://"+filename
      ctx.data=json
      return ctx
    }
  }
  if(ctx.data.template){
    //
  }
  return ctx
}
module.exports = {
  before: {
    all: [ /* authenticate('jwt') */],
    find: [],
    get: [],
    create: [handleCreate],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
