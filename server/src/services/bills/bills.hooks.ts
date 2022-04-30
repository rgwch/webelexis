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
  ctx.data.rnnummer = newNr.toString()
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
    if (obj.extinfo) {
      obj.extjson = util.getExtInfo(obj.extinfo)
      for (const field of fieldlist) {
        const trace = obj.extjson[field]
        if (trace) {
          const decoded = util.unpackStringsFromString(trace)
          obj.extjson[field] = decoded
        } else {
          obj.extjson[field] = []
        }
      }
    }
  }
  return obj;
}


const pack = ctx => {
  delete ctx.data.extjson
  return ctx;
}


const fieldList = ["Ausgegeben", "Statusänderung", "Korrektur", "Zurückgewiesen", "Zahlung"]
const tojson = ctx => {
  if (ctx.method === 'get') {
    ctx.result = unpack(ctx.result, fieldList);
  } else {
    ctx.result.data = unpack(ctx.result.data, fieldList);
  }
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [pack, fi, assignBillNumber],
    update: [pack, fi],
    patch: [fi],
    remove: [],
  },

  after: {
    all: [],
    find: [tojson, fi, addPatient],
    get: [tojson, fi, addPatient],
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
