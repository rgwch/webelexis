/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const abilities=require('../../hooks/abilities')
const acl=require('./acl')

/**
 *
 * @param {*} config
 * @param {*} def
 */
async function getList(config, def) {
  let ret = await config.get("agenda/" + def)
  return ret.split(/ *, */)
}

async function getColors(context, mode, resource) {
  //console.log("colors requested for "+mode+", "+resource)
  //console.log(JSON.stringify(context))
  const service = context.app.service("elexis-userconfig")
  let raw = await service.find({ query: { user: resource, param: { $like: "agenda/farben/" + mode +"/%"} } })
  let ret = {}
  raw.data.forEach(col=>{
    let path=col.Param.split("/")
    let elem=path[path.length-1]
    ret[elem]=col.Value
  })
  return ret
}
const doSort = function (options = {}) {
  return async context => {
    const query = context.app.service('termin').createQuery({ query: context.params.query });
    query.orderByRaw('CAST(Beginn as unsigned)');
    context.params.knex = query;
  }
}



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
        context.result = await getColors(context, "typ", context.params.query.resource)
        break;
      case "statecolors":
        context.result = await getColors(context, "status", context.params.query.resource)
        break;
    }
    return context;
  };
};

const treatDeleted = require('../../hooks/treat-deleted');

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

module.exports = {
  before: {
    all: [abilities({acl})],
    find: [doSort(), treatDeleted()],
    get: [specialQueries()],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [addContacts()],
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
