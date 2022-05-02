/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import {Blob} from './blob.class'

export default function(app){
  // this reads from server/config/[runmode].json
  const options=app.get("blob")
  app.use("/blob", new Blob(options))
}