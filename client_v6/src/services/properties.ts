
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

let production = "isproduction"
export default {
  version: "WEBELEXIS_VERSION",
  build: "WEBELEXIS_BUILDDATE",
  production,

  server: production == "true" ? "/" : "http://localhost:3030",
  mandator: "gerry",
  volatile: {

  },
  REMOVE_MESSAGE: "remove_prescription",
  ADD_MESSAGE: "add_prescription",
  metadata: {}

}

