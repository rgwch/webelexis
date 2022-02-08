import pug from 'pug'
import * as fs from 'fs'
import path from 'path'
import { logger } from '../logger'

export default (basedir, file, metadata) => {
  metadata.pretty = true
  pug.renderFile(path.join(basedir, file), metadata, (err, result) => {
    if (err) {
      logger.error('pug compiler: %s', err)
      throw err
    }
    const outfile = path.join(basedir, path.basename(file, '.pug') + '.html')
    // console.log(path.resolve(outfile))
    fs.writeFileSync(outfile, result)
  })
}
