/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks
import Extinfo from '../../hooks/handle-extinfo'
const handleExtinfo = Extinfo({ extinfo: 'extinfo' })
import flatiron from '../../hooks/flatiron'
import { DateTime } from 'luxon'
import { ElexisUtils } from '../../util/elexis-types'
const fi = flatiron([
  {
    id: 'fallid',
    obj: '_Fall',
    service: 'fall',
  },
  {
    id: 'mandantid',
    obj: '_Mandant',
    service: 'kontakt',
  },
])
const util = new ElexisUtils()

/**
 * When creating a Bill: Assign a new and unique bill number
 * @param ctx
 * @returns
 */
const assignBillNumber = async (ctx) => {
  const config = ctx.app.service('elexis-config')
  const actNr = await config.get('RechnungsNr')
  // if undef
  const newNr = (parseInt(actNr) + 1).toString()
  await config.update('RechnungsNr', {
    param: 'RechnungsNr',
    wert: newNr.toString(),
  })
  ctx.param.rnnummer = newNr.toString()
  return ctx
}

const _addPatient = (bill) => {
  bill._Patname = bill._Fall?._Patient?.bezeichnung1 + " " +
    bill._Fall?._Patient?.bezeichnung2 + ", " + DateTime.fromISO(
      bill._Fall?._Patient?.geburtsdatum
    )?.toLocaleString()
}
const addPatient = async ctx => {
  if (ctx.result.data) {
    if (Array.isArray(ctx.result.data)) {
      for (const bill of ctx.result.data) {
        _addPatient(bill)
      }
    } else {
      _addPatient(ctx.result.data)
    }
  } else {
    _addPatient(ctx.result)
  }
  return ctx;
}

const unpack = (obj, fieldlist: Array<string>) => {
  if (Array.isArray(obj)) {
    for (const o of obj) {
      unpack(o, fieldlist)
    }
  } else {
    if (obj.extjson) {
      for (const field of fieldlist) {
        const trace = obj.extjson[field]
        if (trace) {
          const decoded = util.unpackStringsFromString(trace)
          obj.extjson["_" + field] = decoded
        } else {
          obj.extjson["_" + field] = []
        }
      }
    }
  }
  return obj;
}


const pack = (obj, fieldlist: Array<string>) => {
  if (Array.isArray(obj)) {
    for (const o of obj) {
      pack(o, fieldlist)
    }
  } else {
    if (obj.extjson) {
      for (const field of fieldlist) {
        const trace = obj.extjson["_" + field]
        if (trace) {
          // const decoded = util.packStringsToString(trace)
          // obj.extjson[field] = decoded
          delete obj.extjson["_" + field]
        }
      }
    }
  }
  return obj;
}

const packedField = (fieldlist: Array<string>) => {
  return ctx => {
    switch (ctx.method) {
      case 'get': ctx.result = unpack(ctx.result, fieldlist); break
      case 'find': ctx.result.data = unpack(ctx.result.data, fieldlist); break;
      case 'update':
      case 'patch':
      case 'create':
        ctx.data = pack(ctx.data, fieldlist); break;
      default:
        throw new Error("undefined method in hook")
    }
    return ctx
  }
}
const traces = packedField(["Ausgegeben", "Statusänderung"])

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [handleExtinfo, fi, assignBillNumber],
    update: [handleExtinfo, fi],
    patch: [handleExtinfo, fi],
    remove: [],
  },

  after: {
    all: [],
    find: [handleExtinfo, traces, fi, addPatient],
    get: [handleExtinfo, traces, fi, addPatient],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
}
