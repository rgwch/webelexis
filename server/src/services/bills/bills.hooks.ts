/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks
import Extinfo from '../../hooks/handle-extinfo'
const handleExtinfo = Extinfo({ extinfo: 'extinfo' })
import flatiron from '../../hooks/flatiron'
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

/**
 * Whwn creating a Bill: Assign a new and unique bill number
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

export default {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [handleExtinfo, fi, assignBillNumber],
    update: [handleExtinfo, fi],
    patch: [flatiron],
    remove: [],
  },

  after: {
    all: [],
    find: [handleExtinfo, fi],
    get: [handleExtinfo, fi],
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
