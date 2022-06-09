const fs = require('fs').promises
const path = require('path')
import { logger } from '../../logger'

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

export const ensurePath = async (app, filename): Promise<string> => {
    const base = app.get('docbase') || require('os').homedir()
    const fullpath = path.join(base, filename);
    const dir = path.dirname(fullpath);
    try {
        const stat = await fs.lstat(dir)
    } catch (err) {
        logger.info('Briefe: creating ' + path.resolve(dir))
        const r = await fs.mkdir(dir, { recursive: true })
    }
    return fullpath
}

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
        meta.contents = dox.length > 0 ? dox.join('') : ''
    }
    return ctx
}
