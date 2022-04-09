/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { v4 as uuid } from "uuid"

/**
 * Generate lastupdate value, make sure, deleted is '0',
 * make sure, the object has an unique id, remove type information.
 * To apply before create and update operations
 * @param {*} obj
 */
const do_prepare = (obj, method) => {

  obj.lastupdate = new Date().getTime();
  if (!obj.id) {
    obj.id = uuid()
  }
  if (method == "create") {
    obj.deleted = "0"
  }
  delete obj.type
  /*
  for (const prop in obj) {
    if (prop.startsWith("_")) {
      delete obj[prop];
    }
  }
  */
  return obj
}

export default ctx => {
  if (ctx.data) {
    if (Array.isArray(ctx.data)) {
      for (const item of ctx.data) {
        do_prepare(item, ctx.method)
      }
    } else {
      ctx.data = do_prepare(ctx.data, ctx.method)
    }
  }
}
