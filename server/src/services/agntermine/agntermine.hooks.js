/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const abilities = require('../../hooks/abilities')
const { authenticate } = require('@feathersjs/authentication').hooks;
const acl = require('./acl')
const validate = require('../validator').validate
const { DateTime } = require('luxon')
const Elexistypes=require('../../util/elexis-types')
const Elexis=new Elexistypes()

/**
 *
 * @param {*} config
 * @param {*} def
 */
async function getList(config, def) {
  let ret = await config.get("agenda/" + def)
  return ret.split(/ *, */)
}

/**
 * Get agenda colors for a given user
 * @param {context} hook context
 * @param {mode}  typ or status
 * @param {user}
 */
async function getColors(context, mode, user) {
  //console.log("colors requested for "+mode+", "+resource)
  //console.log(JSON.stringify(context))
  const service = context.app.service("elexis-userconfig")
  let raw = await service.find({ query: { user: user, param: { $like: "agenda/farben/" + mode + "/%" } } })
  let ret = {}
  raw.data.forEach(col => {
    let path = col.Param.split("/")
    let elem = path[path.length - 1]
    ret[elem] = col.Value
  })
  return ret
}
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
    const cfg = context.app.service('elexis-config')
    switch (context.id) {
      case "types": context.result = await getList(cfg, "TerminTypen"); break;
      case "states": context.result = await getList(cfg, "TerminStatus"); break;
      case "resources": context.result = await getList(cfg, "bereiche"); break;
      case "daydefaults": {
        async function getdaydefaults(bereich) {
          let timedef = (await cfg.get("agenda/tagesvorgaben/" + bereich)).substring(7).split("~#<A")
          let result = {}
          timedef.forEach(element => {
            let [a, b] = element.split("=A")
            let times = b.split(/[\n\r]+/)
            result[a] = times
          });
          return result;
        }

        if (context.params.resource) {
          context.result = await getdaydefaults(context.params.resource)
        } else {

          let resources = await getList(cfg, "bereiche")
          let result = {}
          for (let i = 0; i < resources.length; i++) {
            result[resources[i]] = await getdaydefaults(resources[i])

          }
          context.result = result

        }
      }
        break;
      case "timedefaults": {
        const getTimedefaults = async (bereich) => {
          let timedef = (await cfg.get("agenda/zeitvorgaben/" + bereich)).split("::")
          let result = {}
          timedef.forEach(el => {
            let [a, b] = el.split("=")
            result[a] = b
          })
          return result
        }
        if (context.params.resource) {
          context.result = getTimedefaults(context.params.resource)
        } else {
          let resources = await getList(cfg, "bereiche")
          let result = {}
          for (let i = 0; i < resources.length; i++) {
            result[resources[i]] = await getTimedefaults(resources[i])
          }
          context.result = result
        }

      }
        break
      case "typecolors":
        context.result = await getColors(context, "typ", context.params.query.user)
        break;
      case "statecolors":
        context.result = await getColors(context, "status", context.params.query.user)
        break;
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
      if (appnt.PatID) {
        try {
          let k = await s.get(appnt.PatID)
          appnt.kontakt = k
        } catch (Error) {
          if (Error.name === "NotFound") {
            appnt.kontakt = {
              Bezeichnung1: appnt.PatID
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
    const dt = DateTime.fromISO(q.Tag)
    const dayOfWeek = dt.weekday
    let bereich = q.Bereich
    const cfgservice = context.app.service("elexis-config")

    if (!bereich || bereich.trim().length == 0) {
      const bereiche = await getList(cfgservice, "bereiche")
      if (bereiche && bereiche.length > 0) {
        bereich = bereiche[0]
      } else {
        bereich = "default"
      }
    }
    const timedefraw = await cfgservice.get("agenda/tagesvorgaben/" + bereich)
    const timedef = timedefraw.trim().substring(7).split("~#<A")
    let timedefs = {}
    timedef.forEach(element => {
      let [a, b] = element.split("=A")
      let times = b.split(/[\n\r]+/)
      timedefs[a] = times
    });
    const days=["Mo","Di","Mi","Do","Fr","Sa","So"]
    const daydef=timedefs[days[dayOfWeek-1]]
    for(const def of daydef){
      const times=def.split(/\s*-\s*/)
      const from=Elexis.makeMinutes(times[0])
      const until=Elexis.makeMinutes(times[1])
      const appnt={
        Bereich: bereich,
        TerminTyp: "Reserviert",
        TerminStatus: "-",
        Tag:q.Tag,
        Beginn: from.toString(),
        Dauer: (until-from).toString()
      }
      await context.service.create(appnt)
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
    context.data = context.data.map(elem => this.cleanTermin(elem))
  } else {
    context.data = cleanTermin(context.data)
  }
  return context
}

module.exports = {
  before: {
    all: [authenticate('jwt'), abilities({ acl })],
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
