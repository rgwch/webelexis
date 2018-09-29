const logger=require('./logger')
module.exports=function (app){

  const docs = app.service('documents')
  docs.get("1").then(doc => {
    console.log("basic template found")
  }).catch(err => {
    const fs = require('fs')
    const path = require('path')
    const tmpl = fs.readFileSync(path.join(__dirname, "services/documents/example-template.html"))
    const doc = {
      id: "1",
      "template": "1",
      "subject": "Brief Demo",
      contents: tmpl.toString()
    }
    docs.create(doc).then(resp=>{
      logger.info("created dummy document")
    }).catch(err=>{
      logger.error(err)
    })
  })

  const usr=app.service('usr')
  const dummy={
    email: "hans",
    password: "fritz"
  }
  usr.create(dummy).then(u=>{
    logger.info("created dummy user")
  }).catch(err=>{
    logger.error("could not create user: %s",err)
  })
}
