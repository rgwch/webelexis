const tmp = require('tmp')
const unzip = require('extract-zip')
const xmlstream = require('xml-stream')
const fs = require('fs')

const config=JSON.parse(fs.readFileSync('../../config/default.json'))
const knex=require('knex')
const {client,connection}=config.sqlite
const db=knex({client,connection})

const tmpobj = tmp.dirSync()
tmp.setGracefulCleanup()

unzip('/Users/gerry/oddb2xml.zip', { dir: tmpobj.name }, err => {
  if (err) {
    throw (err)
  }
  const input=fs.createReadStream(tmpobj.name+"/oddb_article.xml")
  const xml=new xmlstream(input)
  xml.preserve("ART")
  xml.on('endElement:ART',item=>{
    
  })
})
