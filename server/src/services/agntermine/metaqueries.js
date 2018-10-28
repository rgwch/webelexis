const logger = require('../../logger')
const defaults = require('../../../config/elexisdefaults')

/**
 *
 * @param {*} config
 * @param {*} def
 */
function getList(config, def) {
  config.get("agenda/" + def).then(ret => {
    return ret.split(/\s*,\s*/)
  }).catch(err => {
    logger.warn(err)
    return undefined
  })
}

function getdaydefaults(config, bereich) {
  config.get("agenda/tagesvorgaben/" + bereich).then(raw => {
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

function getTimedefaults(config, bereich) {
  config.get("agenda/zeitvorgaben/" + bereich).then(raw => {
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
  const config = context.app.service("elexis-userconfig")

  config.find({ query: { user: user, param: { $like: `agenda/farben/${mode}/%` } } }).then(raw=>{
    let ret = {}
    raw.data.forEach(col => {
      let path = col.Param.split("/")
      let elem = path[path.length - 1]
      ret[elem] = col.Value
    })
    return ret
  }).catch(err=>{
    logger.warn(err)
    return undefined
  })

}

module.exports = function (app) {
  const elexisconfig = app.service("elexis-config")
  async function terminTypes() {
    return (await getList(elexisconfig, "TerminTypen")) || defaults.termintypdefaults
  }
  const terminStates = async () => (await getList(elexisconfig, "TerminStatus")) || defaults.terminstatedefaults

  const agendaResources = async () => (await getList(elexisconfig, "bereiche")) || defaults.resources

  const daydefaults = async resource => {
    if (resource) {
      return getdaydefaults(elexisconfig, resource)
    } else {
      let resources = await agendaResources()
      let result = {}
      for (let i = 0; i < resources.length; i++) {
        result[resources[i]] = await getdaydefaults(elexisconfig, resources[i])
      }
      return result
    }
  }

  const timeDefaults = async resource => {
    if (resource) {
      return getTimedefaults(elexisconfig, resource)
    } else {
      const resources = await agendaResources();
      let result = {}
      for (let i = 0; i < resources.length; i++) {
        result[resources[i]] = await getTimedefaults(elexisconfig, resources[i])
      }
      return result
    }
  }

  const typeColors = async (user) => {
    return (await getColors(app,"typ",user)) || defaults.typcolordefaults
  }

  const stateColors = async user =>{
    return (await getColors(app,"status",user)) || defaults.statecolordefaults
  }
}
