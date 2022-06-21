/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { CouchDB } from "./couchdb.class";
import { hooks, activate } from "./couchdb.hooks"
import {logger} from '../../logger'

export default function (app) {
  const options = app.get("couchdb")
  const couch = new CouchDB(app, options)
  app.use("/nosql", couch)
  const service = app.service("nosql")
  service.hooks(hooks)
  /*
  couch.checkInstance().then(result=>{
    logger.info("Connection to CouchDB successful")
  }).catch(err=>{
    logger.error("\n*** FATAL: Could not connect to couch database. Aborting ***\n "+err)
    process.exit(43)
  })
  */
}
