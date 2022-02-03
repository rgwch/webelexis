/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks
const ElexisUtils = require('../../util/elexis-types')
const util = new ElexisUtils()
const Samdas = require('@rgwch/samdastools')
const logger = require('../../logger')

/**
 * Find ecnounters by patient id
 * @param {*} context
 */
const withPatientId = async (context) => {
  if (context.params.query && context.params.query.patientId) {
    const pid = context.params.query.patientId
    delete context.params.query.patientId
    const fallService = context.app.service('fall')
    const faelle = await fallService.find({
      query: { patientid: pid, $select: ['id'] },
    })
    const fallids = faelle.data.map((fall) => {
      return {
        fallid: fall.id,
      }
    })
    if (fallids && fallids.length > 0) {
      context.params.query.$or = fallids
    } else {
      context.params.query.fallid = '--'
    }
    if (!context.params.query.deleted) {
      context.params.query.deleted = '0'
    }
    context.params.query.$sort = {
      datum: -1,
    }
    //const qq=context.app.service('konsultation').createQuery({query: context.params.query})
    //logger.silly(qq.toString())
    return context
  }
}
const doSort = (context) => {
  const query = context.app
    .service('konsultation')
    .createQuery({ query: context.params.query })
  query.orderBy('datum', 'desc')
  context.params.knex = query
  return context
}
/**
 * Hook to apply after find()
 * Convert encounter entries from Elexis internal VersionedResource/Samdas to
 * html (of the latest Version)
 */
const readKonsText = (context) => {
  const raw = context.result
  const cooked = []
  if (raw && raw.data) {
    const entries = []
    for (let kons of raw.data) {
      if (kons.eintrag == null) {
        kons.eintrag = { html: '<p></p>' }
      }
      if (kons.eintrag.html) {
        entries.push(Promise.resolve(kons.eintrag.html))
      } else {
        const entry = util.getVersionedResource(kons.eintrag)
        if (entry.text) {
          entries.push(Samdas.toHtml(entry.text))
        } else {
          entries.push('<p></p>')
          logger.warn('Empty record ' + kons.id)
        }

        kons.eintrag = {
          remark: entry.remark,
          timestamp: entry.timestamp,
        }
      }
    }
    return Promise.all(entries)
      .then((converted) => {
        converted.forEach((entry, index) => {
          raw.data[index].eintrag.html = entry
        })
        return context
      })
      .catch((err) => {
        logger.error('Error reading kons Text ' + err)
      })
  }
}

/**
 * Hook to apply before update. Convert HTML to Samdas and update the encpunter's
 * VersionedResource
 */
const updateKonsText = async (context) => {
  try {
    const html = context.data.eintrag.html
    if (html) {
      const samdas = Samdas.fromHtml(html)
      if (samdas) {
        const kons = await context.service.get(context.data.id)
        let versionedResource = kons.eintrag
        if (!versionedResource) {
          versionedResource = util.createVersionedResource()
        } else {
          const entry = util.getVersionedResource(versionedResource)
          if (!entry.text) {
            versionedResource = util.createVersionedResource()
          }
        }
        const vrUpdated = util.updateVersionedResource(
          versionedResource,
          samdas,
          context.data.eintrag.remark,
        )
        context.data.eintrag = Buffer.from(vrUpdated)
      } else {
        logger.warning('converting html to samdas ' + html)
      }
    }
    return context
  } catch (err) {
    logger.error('Updating kons ' + err)
    throw new Error('Could not store ' + JSON.stringify(context.data.eintrag))
  }
}
/**
 * Hook to apply after find: Convert HTML text to samdas and create a new entry
 * in the encounter's Versioned Resource with that Samdas text.
 * @param {*} context
 */
const createKonsText = async (context) => {
  try {
    const kons = context.data
    const html = kons.eintrag.html
    if (html) {
      const samdas = Samdas.fromHtml(html)
      if (samdas) {
        delete kons.eintrag.html
        const versionedResource = util.createVersionedResource()
        const vrUpdated = util.updateVersionedResource(
          versionedResource,
          samdas,
          kons.eintrag.remark,
        )
        kons.eintrag = Buffer.from(vrUpdated)
      } else {
        logger.warning('converting html to samdas ' + html)
      }
    }
    return context
  } catch (err) {
    logger.error('Creating kons ' + err)
    throw new Error('Could not store ' + JSON.stringify(context.data.eintrag))
  }
}

/**
 * Find a String inside the text content.
 * @param {*} context
 */
const textContents = async (context) => {
  if (context.params.query && context.params.query.$find) {
    const expr = context.params.query.$find
    const re = new RegExp(expr, 'i')
    delete context.params.query.$find
    context.params.query.$limit = 500
    let raw = await context.service.find(context.params)
    if (raw && raw.data) {
      let processed = []
      for (const k of raw.data) {
        if (k.eintrag && k.eintrag.html) {
          const textonly = k.eintrag.html.replace(/<.+?>/g, '')
          if (re.test(textonly)) {
            processed.push(k)
          }
        }
      }
      context.result = raw
      context.result.total = processed.length
      context.result.data = processed
    }
  }
  return context
}

const allowNull = (ctx) => {
  if (ctx.params.query?.rechnungsid === 'null') {
    ctx.params.query.rechnungsid = null
    return ctx
  }
}

const unbilled = async (ctx) => {
  if (ctx.id === 'unbilled') {
    // const query = 'SELECT distinct PATIENTID FROM FAELLE '
    // "JOIN BEHANDLUNGEN ON BEHANDLUNGEN.FALLID=FAELLE.ID WHERE BEHANDLUNGEN.deleted='1' AND BEHANDLUNGEN.billable='1' AND BEHANDLUNGEN.RECHNUNGSID = 'blah' "
    const knex = ctx.app.get('knexClient')
    const query = knex("faelle").join("behandlungen", "behandlungen.fallid", "=", "faelle.id")
      .join("kontakt", "kontakt.id", "faelle.patientid")
      .whereNull("behandlungen.rechnungsid")
      .select("faelle.patientid", "behandlungen.id as konsid", "faelle.id as fallid",
        "faelle.datumvon as falldatum", "faelle.bezeichnung as falltitel", "behandlungen.datum as konsdatum",
        "kontakt.bezeichnung1 as lastname", "kontakt.bezeichnung2 as firstname")
      .orderBy([{ column: 'lastname', order: 'desc' }, { column: 'firstname', order: 'desc' },{column: 'konsdatum', order:"desc"}])
    const result = await query
    ctx.result = result
  }
  return ctx
}

export default {
  before: {
    all: [
      /* authenticate('jwt') */
    ],
    find: [allowNull, withPatientId, textContents],
    get: [unbilled],
    create: [createKonsText],
    update: [updateKonsText],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [readKonsText],
    get: [],
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
