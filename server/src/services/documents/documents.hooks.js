/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks;
const fetch = require('node-fetch')
const logger = require('../../logger');
const fs = require('fs').promises
const path = require('path')
const getStream = require('get-stream')
const intoStream = require('into-stream')
const uuid = require('uuid/v4')

const uri_regexp = /\w+:\/\/(\/?\/?)[^\s]+/

getStorage = ctx => {
  let storage = ctx.app.get('solr').filestore
  if (!storage) {
    log.error("solr.filestore not defined in app onfiguration")
    throw new Error("Filestore not found")
  }
  if (!storage.startsWith("/")) {
    storage = path.join(process.env.HOME, storage)
  }
  return storage
}

// logger.level="debug"

/**
 * When creating a document, some cases are recognized:
 * - If the contents-field is an URI, the file is indexed through solr/lucene and stored in the filesystem
 * - if the template field is not null, the contents is merged with the template. In that case,
 *   contents can be JSON or html. The resulting document is sent to solr and stored in the filesystem.
 * - if contents is not an URI and template is falsey, the data is simply sent to solr.
 * @param {} ctx
 */
const handleCreate = async ctx => {
  if (ctx.data && ctx.data.contents) {
    if (uri_regexp.exec(ctx.data.contents)) {
      /* TIKA parser */
      let cnt
      if (ctx.data.contents.startsWith("file://")) {
        const url = new URL(ctx.data.contents)
        cnt = await fs.readFile(url)
      } else {
        const res = await fetch(ctx.data.contents)
        cnt = await getStream(res.body)
      }

      const addr = ctx.app.get('solr').tika
      if (!addr) {
        log.error("solr.tika not defined in app configuration")
        throw new Error("Tika not found")
      }

      const meta = await fetch(addr + "/meta", { headers: { accept: "application/json" }, method: "put", body: intoStream(cnt) })
      if (meta.status != 200) {
        throw new Error(meta.statusText)
      }
      const text = await fetch(addr + "/tika", { headers: { accept: "text/plain" }, method: "put", body: intoStream(cnt) })
      if (text.status != 200) {
        throw new Error(result.statusText)
      }
      const json = await meta.json()
      json.contents = (await text.text()).trim()

      const storage = getStorage(ctx)

      let fname = json.filename || json.title
      if (fname) {
        fname = encodeURIComponent(fname)
      } else {
        fname = uuid()
      }
      let dir = path.join(storage, (json.concern || "."))
      await fs.mkdir(dir, { recursive: true })
      let filename = path.join(dir, fname)
      const written = await fs.writeFile(filename, cnt)
      json.loc = path.join((json.concern || "."), fname);
      if (!json.id) {
        json.id = uuid()
      }
      ctx.data = json
      return ctx
    }
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
  if (ctx.id) {
    const doc = await ctx.service.get(ctx.id)
    if (doc.loc && !uri_regexp.exec(doc.loc)) {
      const storage = getStorage(ctx)
      const fname = path.join(storage, doc.loc)
      await fs.unlink(fname)
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
    update: [],
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
