/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const fetch = require('node-fetch')
const log = require('../../logger');
const fs = require('fs').promises
const path = require('path')
const getStream = require('get-stream')
const uuid = require('uuid/v4')
const api = require('./solr')
const ocr = require('../../util/ocr')

const uri_regexp = /\w+:\/\/(\/?\/?)[^\s]+/


// logger.level="debug"

const loadContents = async (ctx, storage) => {
  let cnt
  let filename
  try {
    if (uri_regexp.exec(ctx.data.contents) || ctx.data.contents.startsWith(storage)) {
      if (ctx.data.contents.startsWith("file://")) {
        const url = new URL(ctx.data.contents)
        filename = path.basename(ctx.data.contents.substring(6))
        cnt = await fs.readFile(url)
      } else if (ctx.data.contents.startsWith(storage)) {
        filename = path.basename(ct.data.contents.substring(storage.length))
        cnt = await fs.readFile(ctx.data.contents)
      } else {
        filename = ctx.data.contents
        const res = await fetch(ctx.data.contents)
        cnt = await getStream(res.body)
      }
    } else {
      cnt = ctx.data.contents
    }
  } catch (err) {
    log.error("File error when trying to load " + filename)
    throw new Error(err)
  }
  return { filename, cnt }
}

/**
 * When creating a document, some cases are recognized:
 * - If the contents-field is an URI, the file is fetched, indexed through solr/lucene and stored in the filesystem
 * - if the template field is not null, the contents is merged with the template. In that case,
 *   contents can be JSON or html. The resulting document is sent to solr and stored in the filesystem.
 * - if contents is not an URI and template is falsey, the data is simply sent to solr.
 * @param {} ctx
 */
const handleCreate = async ctx => {
  const storage = api.getStorage(ctx.app)
  if (ctx.data && ctx.data.contents) {
    const extractor = require('./extract')(ctx.app)
    const { filename, cnt } = await loadContents(ctx)
    log.debug("extracting " + (filename || "binary"))
    let extracted = await extractor.tika(cnt)
    const json = Object.assign({}, extracted.meta, ctx.data)

    if (!ctx.params || !ctx.params.inPlace) {
      if (json.title.toLowerCase() == "untitled") {
        delete json.title
      }
      let fname = json.filename || json.title
      if (fname) {
        fname = encodeURIComponent(fname)
      } else {
        fname = uuid()
      }
      let dir = path.join(storage, (json.concern || "."))
      try {
        await fs.mkdir(dir, { recursive: true })
      } catch (err) {
        if (err.code != "EEXIST") {
          throw (err)
        }
      }
      let filename = path.join(dir, fname)
      const written = await fs.writeFile(filename, cnt)
      json.loc = path.join((json.concern || "."), fname);
    } else {
      json.loc = json.contents
    }
    json.contents = extracted.text
    json.id = api.makeFileID(ctx.app, json.loc)
    if (!json.id) {
      json.id = uuid()
    }
    if (json.loc.startsWith(storage)) {
      json.loc = json.loc.substring(storage.length + 1)
    }
    if (!json.title) {
      const ext = path.extname(json.loc)
      const base = path.basename(json.loc, ext)
      json.title = base
    }
    ctx.data = json
    if (extracted.text.length < 5) {
      extractor.ocr({ meta: json, contents: cnt })
    }

    return ctx
  }
  if (ctx.data.template) {
    //
  }
  return ctx
}

/**
 * if it's a local file: Delete it physically
 * @param {} ctx
 */
const handleDelete = async ctx => {
  if (Array.isArray(ctx.result)) {
    const ctxr = ctx
    handleDelete(ctx.result.map(el => { ctxr.result = el; return ctxr }))
  }
  const doc = ctx.result
  if (doc && doc.loc && !uri_regexp.exec(doc.loc)) {
    const storage = api.getStorage(ctx.app)
    const fname = path.join(storage, doc.loc)
    await fs.unlink(fname)
  }
  return ctx
}

/**
 * Update only metadata or contents. If data.contents is given, will write a new file in the store.
 * If not, only Metadata is updated.
 * @param {*} ctx
 */
const handleUpdate = async ctx => {
  const { id, data } = ctx
  if (id && data.contents) {
    if (data.loc && uri_regexp.exec(data.loc)) {
      const { filename, cnt } = await loadContents(ctx)
      const storage = api.getStorage(ctx.app)
      const fpath = path.join(storage, data.loc)
      data.lastupdate = Date.now()
      data.id = id
      const written = await fs.writeFile(fpath, data.contents)
      delete data.contents
      log.info("updated " + fpath)
    }
  }
  return ctx
}

module.exports = {
  before: {
    all: [ /* authenticate('jwt') */],
    find: [],
    get: [],
    create: [handleCreate],
    update: [handleUpdate],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [handleDelete]
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
