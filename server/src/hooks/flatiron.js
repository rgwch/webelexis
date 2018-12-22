/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/*
  Fetch Objects for ids when loading objects and remove thiese objects when storing
  flatten is used before create and update, fold ist used after get and find
  Options: An Array of objects like:
    {
      id: field that holds "flat" id
      obj: field that hold "folded" object
      service: service to fetch and store objects
      prefix: optional prefix to identify id
    }
*/

const flatten = (ctx, fieldlist) => {
  return ctx => {
    for (const field of fieldlist) {
      // note: typeof(null) is 'object'. Don't ask why. So double check here.
      const obj = ctx.data[field.obj]
      if (obj && typeof obj == 'object' && obj.id) {
        const prefix = field.prefix ? field.prefix + "::" : ""
        ctx.data[field.id] = prefix + obj.id
      }
    }
    return ctx
  }
}

const fold = async (app, obj, fieldlist) => {
  for (const field of fieldlist) {
    if (obj[field.id] && field.service) {
      const rel = app.service(field.service)
      obj[field.obj] = await rel.get(obj[field.id])
    }
  }
  return obj
}
module.exports = fieldlist => {
  return async ctx => {
    switch (ctx.method) {
      case 'get': return fold(ctx.app, ctx.result, fieldlist)
    }

  }
}
