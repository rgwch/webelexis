const { authenticate } = require('@feathersjs/authentication').hooks;
const fs = require('fs').promises
const path = require('path')

const retrieve = async ctx => {
  const meta = ctx.result
  const cfg = ctx.app.get('userconfig')
  const base = cfg['docbase'] || require('os').homedir()
  if (meta.Path) {
    meta.contents = await fs.readFile(path.join(base, meta.Path), { encoding: 'utf-8' })
  } else {
    const db = ctx.service.Model
    const dox = await db('heap').select('inhalt').where({ id: meta.id, deleted: "0" })
  }
  return ctx
}

const store = async ctx => {
  const cfg = ctx.app.get('userconfig')
  const base = cfg['docbase'] || require('os').homedir()
  const dir = path.dirname(ctx.data.Path)
  if (dir.length > 0 && dir != ".") {
    const fullpath = path.join(base, dir)
    try {
      const stat = await fs.lstat(fullpath)
    } catch (err) {
      const r = await fs.mkdir(fullpath, { recursive: true })
    }
  }

  const contents = ctx.data.contents
  delete ctx.data.contents
  const result = await fs.writeFile(path.join(base, ctx.data.Path), contents, { encoding: 'utf-8', mode: 0o600 })
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
    remove: []
  },

  after: {
    all: [],
    find: [],
    get: [retrieve],
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
