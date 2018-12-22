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

const flatten = (item, fieldlist) => {
  for (const field of fieldlist) {
    // note: typeof(null) is 'object'. Don't ask why. So double check here.
    const obj = item[field.obj]
    if (obj && typeof obj == 'object' && obj.id) {
      const prefix = field.prefix ? field.prefix + "::" : ""
      item[field.id] = prefix + obj.id
      delete item[field.obj]
    }
  }
  return item
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
      case 'get': await fold(ctx.app, ctx.result, fieldlist); break
      case 'find':
        for (const el of ctx.result.data) {
          await fold(ctx.app, el, fieldlist)
        }
        break;
      case 'create':
      case 'update':
        if (Array.isArray(ctx.data)) {
          for (const elem of ctx.data) {
            flatten(elem, fieldlist)
          }
        } else {
          ctx.data=flatten(ctx.data, fieldlist)
        }
        break;
    }
    return ctx
  }
}
