/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const validate = require('../validator').validate
import { DateTime } from 'luxon'
import { ElexisUtils } from '../../util/elexis-types'
const Elexis = new ElexisUtils()
import metaqueries from './metaqueries'
import { logger } from '../../logger'


/**
 * Hook to sort appointments by begin time. Since time is encoded as string but meant als minutes
 * from midnight, we have to cast string to integer before sorting. (Otherwise 1000 would be before 900)
 */
const doSort = function (options = {}) {
  return async context => {
    const query = context.app.service('termin').createQuery({ query: context.params.query });
    query.orderByRaw('CAST(Beginn as unsigned)');
    context.params.knex = query;
  }
}


/**
 * Hook to perform queries on agenda metadata.
 * The following queries are supported:
 * - types: query possible appointment types
 * - states: query possible appointment states
 * - resources: query agenda resources (Bereiche)
 * - daydefaults: default locked times per weekday
 * - timedefaults: default duration of appointment by type
 * - typecolors: preferred colors (as hex string) for all types
 * - statecolors: preferred colors (as hex string) for all states
 * Example: get('types') would return an array with all defined appointment types
 */
const specialQueries = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const mq = metaqueries(context.app)
    switch (context.id) {
      case "types": context.result = await mq.terminTypes(); break;
      case "states": context.result = await mq.terminStates(); break;
      case "resources": context.result = await mq.agendaResources(); break;
      case "daydefaults": context.result = await mq.daydefaults(context.params.resource); break
      case "timedefaults": context.result = await mq.timeDefaults(context.params.resource); break;
      case "typecolors": context.result = await mq.typeColors(context.params.query.user); break
      case "statecolors": context.result = await mq.stateColors(context.params.query.user); break;
    }
    return context;
  };
};

/**
 * Hook to expand the "PatID" field (id of the concerned patient, or name of the appointment)
 * to a full "kontakt" entry. If no such 'Kontakt' exists in the database, the PatID is
 * kept by itself as concern data.
 */
const addContacts = function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    const s = context.app.service('kontakt')
    for (let i = 0; i < context.result.data.length; i++) {
      let appnt = context.result.data[i]
      if (appnt.patid) {
        try {
          let k = await s.get(appnt.patid)
          appnt.kontakt = k
        } catch (Error) {
          if (Error.name === "NotFound") {
            appnt.kontakt = {
              bezeichnung1: appnt.patid
            }
          } else {
            throw (Error)
          }
        }
      }
    }
    return context;
  };
};

const checkLimits = async context => {
  if (context.result.data.length == 0) {
    let q = context.params.query
    const dt = DateTime.fromISO(q.tag)
    const dayOfWeek = dt.weekday
    let bereich = q.bereich
    const mq = metaqueries(context.app)
    if (!bereich || bereich.trim().length == 0) {
      const bereiche = await mq.agendaResources()
      if (bereiche && bereiche.length > 0) {
        bereich = bereiche[0]
      } else {
        bereich = "default"
      }
    }
    const daydefs = await mq.daydefaults(bereich)
    const days = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]
    const daydef = daydefs[days[dayOfWeek - 1]]
    const types = await mq.terminTypes()
    const states = await mq.terminStates()
    for (const def of daydef) {
      const times = def.split(/\s*-\s*/)
      const from = Elexis.makeMinutes(times[0])
      const until = Elexis.makeMinutes(times[1])
      const appnt = {
        bereich: bereich,
        termintyp: types[1],
        terminstatus: states[0],
        tag: q.tag,
        beginn: from.toString(),
        dauer: (until - from).toString()
      }
      try {
        const inserted = await context.service.create(appnt)
        logger.debug("inserted " + inserted)
      } catch (err) {
        logger.error("agntermine inser error" + err)
      }
    }
    return context
  }
}
/**
 * Make sure only valid appointment objects get to the database
 * @param {*} termin
 */
const cleanTermin = termin => {
  return validate(termin, 'agntermine', false)
}
const cleanup = context => {
  if (Array.isArray(context.data)) {
    context.data = context.data.map(elem => cleanTermin(elem))
  } else {
    context.data = cleanTermin(context.data)
  }
  return context
}

export default {
  before: {
    all: [authenticate('jwt')],
    find: [doSort()],
    get: [specialQueries()],
    create: [cleanup],
    update: [cleanup],
    patch: [cleanup],
    remove: []
  },

  after: {
    all: [],
    find: [addContacts(), checkLimits],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
