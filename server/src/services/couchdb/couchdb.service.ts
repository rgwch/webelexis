/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { CouchDB } from "./couchdb.class";
import { hooks, activate } from "./couchdb.hooks"

export default function (app) {
  const options = app.get("couchdb")
  const couch = new CouchDB(app, options)
  app.use("/nosql", couch)
  const service = app.service("nosql")
  service.hooks(hooks)
}
