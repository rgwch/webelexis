const { authenticate } = require('@feathersjs/authentication').hooks;
const logger = require('../../logger');
// logger.level="debug"

/**
 * When creating a document, some cases are recognized:
 * - If the contents-field is an URI, the file is indexed through solr/lucene
 * - if the template field is not null, the contents is merged with the template. In that case,
 *   contents can be JSON or html. The resulting document is indexed through lucene and stored in the filesystem.
 * - if contents is not an URI and template is falsey, the contents is stored in the local database.
 * @param {} ctx
 */
const uri_regexp = /\w+:\/\/(\/?\/?)[^\s]+/
const handleCreate = async ctx => {
  if (ctx.data && ctx.data.contents) {
    if (uri_regexp.exec(ctx.data.contents)) {
      const solrService=ctx.app.service('solr')
      const created=await solrService.create(ctx.data)
      console.log(created)
    }
  }
  if(ctx.data.template){
    //
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
