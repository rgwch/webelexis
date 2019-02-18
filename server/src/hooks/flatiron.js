/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const logger = require('../logger')

/*
  Fetch Objects for foreign-key ids when loading objects and remove these objects when storing
  flatten is used /before/ create and update, fold is used /after/ get and find
  Options: An Array of objects like:
    {
      id: field that holds "flat" foreign key
      obj: field that holds "folded" object
      service: service to fetch and store objects of the type denoted by the foreign key
      prefix: optional prefix to identify id
    }
*/

/**
 * remove the object from the [obj] field and insert a foreign key in the [id] field instead.
 * @param {*} item The object to consider
 * @param {*} fieldlist the fields to handle (see field definition above)
 */
const flatten = (item, fieldlist) => {
  for (const field of fieldlist) {
    // note: typeof(null) is 'object'. Don't ask why. So double check here.
    const obj = item[field.obj]
    if (obj && typeof obj == 'object' && obj.id) {
      const prefix = field.prefix ? field.prefix + "::" : ""
      item[field.id] = prefix + obj.id
    }
    delete item[field.obj]
  }
  return item
}

/**
 * For each foreign key in fieldlist: fetch the corresponding object and store it in the [obj] field.
 * @param {*} app reference to the app object
 * @param {*} obj the Object to consider
 * @param {*} fieldlist a list of field definitions (see above)
 */
const fold = async (app, obj, fieldlist) => {
  for (const field of fieldlist) {
    if (obj[field.id] && field.service) {
      const rel = app.service(field.service)
      try {
        obj[field.obj] = await rel.get(obj[field.id])
      } catch (err) {
        logger.error("flatiron %s / %s / %s",JSON.stringify(obj), JSON.stringify(fieldlist), err)
      }
    }
  }
  return obj
}

/**
 * Hook function for flatten and fold
 */
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
          ctx.data = flatten(ctx.data, fieldlist)
        }
        break;
    }
    return ctx
  }
}
