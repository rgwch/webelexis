const NeDB = require('nedb')
const path = require('path')
import { logger } from '../logger'

export default function (app) {
  const dbPath = app.get('nedb')
  const Model = new NeDB({
    filename: path.join(dbPath, 'documents.db'),
    autoload: true,
  })

  return Model
}
