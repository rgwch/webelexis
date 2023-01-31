/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import * as fs from 'node:fs/promises';
import path from 'path'
import { DateTime } from 'luxon'
import compilePug from '../../util/compile-pug'

import { logger } from '../../logger'

/**
 * store ctx.data.contents in a file in ctx.data.path (relative to docbase)
 * @param ctx feathers hook context
 * @returns 
 */
export const store = async (ctx) => {
  const storepath = await ensurePath(ctx.app, ctx.data.path)
  const contents = ctx.data.contents
  delete ctx.data.contents
  if (contents) {
    logger.debug('writing file ' + path.resolve(storepath))
    const result = await fs.writeFile(storepath, contents, {
      encoding: 'utf-8',
      mode: 0o600,
    })
  }
  return ctx
}

/**
 * ensure that the path to store the file exists. If not, try to create directory including all in path 
 * @param app 
 * @param filename - pathname relative to the configured docbase 
 * @returns the full absolute system path (inclucing docbase) of the file.
 */
export const ensurePath = async (app, filename:string): Promise<string> => {
  const base = app.get('docbase') || require('os').homedir()
  let subdir = "documents/"+ (filename ? filename.substring(0, 1).toLocaleLowerCase() : 'nx')
  if(filename.startsWith("templates")){
    subdir="."
  }
  const fullpath = path.join(base, subdir, filename);
  const dir = path.dirname(fullpath);
  try {
    const stat = await fs.lstat(dir)
  } catch (err) {
    logger.info('Briefe: creating ' + path.resolve(dir))
    const r = await fs.mkdir(dir, { recursive: true })
  }
  return fullpath
}

/**
 * load the file named in ctx.result.path (relative do docbase)
 * @param ctx feathers hook context
 * @returns 
 */
export const retrieve = async (ctx) => {
  const meta = ctx.result
  if (meta.path) {
    const readpath = await ensurePath(ctx.app, meta.path)
    logger.debug('trying to read ' + path.resolve(readpath))
    const dox = await fs.readFile(readpath, { encoding: 'utf-8' })
    meta.contents = dox
  } else {
    const db = ctx.service.Model
    const dox = await db('heap')
      .select('inhalt')
      .where({ id: meta.id, deleted: '0' })
    // meta.contents = dox.length > 0 ? dox.join('') : ''
    meta.contents = dox.length > 0 ? Buffer.from(dox[0].inhalt) : ''
  }
  return ctx
}

/**
 * Called un system launch: Import templates in docbase/templates  
 * @param app 
 */
export const autoImport = app => {
  const cfg = app.get("mandators")
  cfg.mandator = cfg.default
  cfg.docbase = app.get("docbase")
  if (cfg.docbase) {
    const templatesDir = path.resolve(path.join(cfg.docbase, "templates"))

    fs.readdir(templatesDir).then(files => {

      for (const file of files) {
        if (file.endsWith('.pug')) {
          compilePug(templatesDir, file, cfg)
        }
      }
      const templates = []
      for (const file of files) {
        if (file.endsWith(".html")) {
          const basename = path.basename(file, ".html")
          templates.push(matchTemplate(app.service("briefe"), basename))
        }
      }
      Promise.all(templates).then(r => {
        logger.info(`imported ${r.length} templates from ${templatesDir}`)
      })
    }).catch(err => {
      logger.error("could not read template dir %s:%s", templatesDir, err)

    })

  }
}

const matchTemplate = (service, name) => {
  return service.find({ query: { Betreff: name + "_webelexis" } }).then(briefe => {
    if (briefe.data.length > 0) {
      const brief = briefe.data[0]
      if (brief.path != `templates/${name}.html`) {
        brief.path = `templates/${name}.html`
        return service.update(brief.id, brief)
      }
    } else {
      const brief = {
        betreff: name + "_webelexis",
        typ: "Vorlagen",
        path: `templates/${name}.html`,
        mimetype: "text/html",
        datum: DateTime.local().toFormat('yyyyLLddhhmmss')
      }
      return service.create(brief)
    }
  })
}
