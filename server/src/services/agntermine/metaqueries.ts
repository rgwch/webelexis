/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../../logger'
let defaults = {
  resources: [], daydefaults: "",
  termintypdefaults: [], terminstatedefaults: [],
  statecolordefaults: {}, typcolordefaults: {}, timedefaults: {}
}

/**
 *
 * @param {*} config
 * @param {*} def
 */
function getList(config, def): Promise<Array<string>> {
  return config.get("agenda/" + def).then(ret => {
    return ret.split(/\s*,\s*/)
  }).catch(err => {
    logger.warn(err)
    return undefined
  })
}

/**
 * Get the available slots for a resource
 * @param {service} config
 * @param {string} bereich  the resource
 */
function getdaydefaults(config, bereich) {
  return config.get("agenda/tagesvorgaben/" + bereich).then(raw => {
    const timedef = raw.trim().substring(7).split("~#<A")
    let result = {}
    timedef.forEach(element => {
      let [a, b] = element.split("=A")
      let times = b.split(/[\n\r]+/)
      result[a] = times
    });
    return result;
  }).catch(err => {
    logger.warn(err)
    return defaults.daydefaults.trim()
  })
}

/**
 * Get the preset durations for each appointment type of a resource
 * @param {service} config
 * @param {string} bereich
 */
function getTimedefaults(config, bereich) {
  return config.get("agenda/zeitvorgaben/" + bereich).then(raw => {
    const timedef = raw.trim().split("::")
    let result = {}
    timedef.forEach(el => {
      let [a, b] = el.split("=")
      result[a] = b
    })
    return result
  }).catch(err => {
    logger.warn(err)
    return defaults.timedefaults
  })
}

/**
 * Get agenda colors for a given user
 * @param {context} hook context
 * @param {mode}  typ or status
 * @param {user}
 */
function getColors(app, mode, user) {
  //console.log("colors requested for "+mode+", "+resource)

  const config = app.service("elexis-userconfig")

  return config.find({ query: { user: user, param: { $like: `agenda/farben/${mode}/%` } } }).then(raw => {
    let ret = {}
    raw.data.forEach(col => {
      let path = col.param.split("/")
      let elem = path[path.length - 1]
      ret[elem] = col.value
    })
    return ret
  }).catch(err => {
    logger.warn(err)
    return undefined
  })

}

type metadata = {
  terminTypes?: any
  terminStates?: any
  agendaResources?: any
  daydefaults?: any
  timeDefaults?: any
  typeColors?: any
  stateColors?: any
}
export default (app): metadata => {
  const elexisconfig = app.service("elexis-config")
  const meta: metadata = {}
  defaults = app.get("agenda")

  /** fetch predefined appointment types */
  meta.terminTypes = async () => (await getList(elexisconfig, "TerminTypen")) || defaults.termintypdefaults
  /** fetch predefined appointment states */
  meta.terminStates = async () => (await getList(elexisconfig, "TerminStatus")) || defaults.terminstatedefaults
  /** fetch predefined agenda resources */
  meta.agendaResources = async () => (await getList(elexisconfig, "bereiche")) || defaults.resources

  /**
   * fetch the predefined not-schedulable times for each weekday for the given resource
   * @param {string} resource
   */
  meta.daydefaults = async resource => {
    if (resource) {
      return await getdaydefaults(elexisconfig, resource)
    } else {
      let resources = await meta.agendaResources()
      let result = {}
      for (let i = 0; i < resources.length; i++) {
        result[resources[i]] = await getdaydefaults(elexisconfig, resources[i])
      }
      return result
    }
  }

  /**
   * fetch the predefined durations for eacht appointment type of the given resource
   * @param {string} resource
   */
  meta.timeDefaults = async resource => {
    if (resource) {
      return getTimedefaults(elexisconfig, resource)
    } else {
      const resources = await meta.agendaResources();
      let result = {}
      for (let i = 0; i < resources.length; i++) {
        result[resources[i]] = await getTimedefaults(elexisconfig, resources[i])
      }
      return result
    }
  }

  /**
   * get a list of colors for appointment types defined for a given user. If there is no
   * color set for that user, return a default color set.
   * @param {string} user
   */
  meta.typeColors = async (user) => {
    return (await getColors(app, "typ", user)) || defaults.typcolordefaults
  }

  /**
    * get a list of colors for appointment states defined for a given user. If there is no
    * color set for that user, return a default color set.
    * @param {string} user
    */
  meta.stateColors = async user => {
    return (await getColors(app, "status", user)) || defaults.statecolordefaults
  }

  return meta
}
