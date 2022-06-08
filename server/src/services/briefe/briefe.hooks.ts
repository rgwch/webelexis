/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const { authenticate } = require('@feathersjs/authentication').hooks
const fs = require('fs').promises
const path = require('path')
import { logger } from '../../logger'

const retrieve = async (ctx) => {
  const meta = ctx.result
  const base = ctx.app.get('docbase') || require('os').homedir()
  if (meta.path) {
    const readpath = path.join(base, meta.path)
    logger.debug('trying to read ' + path.resolve(readpath))
    const dox = await fs.readFile(readpath, { encoding: 'utf-8' })
    meta.contents = dox
  } else {
    const db = ctx.service.Model
    const dox = await db('heap')
      .select('inhalt')
      .where({ id: meta.id, deleted: '0' })
    meta.contents = dox.length > 0 ? dox.join('') : ''
  }
  return ctx
}

const store = async (ctx) => {
  const base = ctx.app.get('docbase') || require('os').homedir()
  const dir = path.dirname(ctx.data.path)
  if (dir.length > 0 && dir != '.') {
    const fullpath = path.join(base, dir)
    try {
      const stat = await fs.lstat(fullpath)
    } catch (err) {
      logger.info('Briefe: creating ' + path.resolve(fullpath))
      const r = await fs.mkdir(fullpath, { recursive: true })
    }
  }

  const contents = ctx.data.contents
  delete ctx.data.contents
  if (contents) {
    const storepath = path.join(base, ctx.data.Path)
    logger.debug('writing file ' + path.resolve(storepath))
    const result = await fs.writeFile(storepath, contents, {
      encoding: 'utf-8',
      mode: 0o600,
    })
  }
  return ctx
}
module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [],
    get: [],
    create: [store],
    update: [store],
    patch: [],
    remove: [],
  },

  after: {
    all: [],
    find: [],
    get: [retrieve],
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
