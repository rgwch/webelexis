const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');

/**
 * special queries: forPatient: id
 * and "all:true"
 */
const special = async context => {
  if (context.params.query && context.params.query.forPatient) {
    const knex = context.app.get("knexClient")
    let query = knex('etiketten').join('etiketten_object_link', "id", "etikette").where('obj', context.params.query.forPatient)
    // console.log(query.toString())
    const stickers = await query
    context.result = stickers
    return context
  }
}

const addImage = async context => {
  const knex = context.app.get('knexClient')
  if (context.result.data) {
    for (const sticker of context.result.data) {
      const imageId = sticker.Image
      const image = await knex('dbimage').where("id", imageId)
      if (image && image.length > 0) {
        const imgdata = image[0].Bild
        sticker.imagedata = imgdata
      }
    }
  }
  return context
}

module.exports = {
  before: {
    all: [authenticate('jwt')],
    find: [special, treatDeleted()],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [addImage],
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
