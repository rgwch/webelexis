const { authenticate } = require('@feathersjs/authentication').hooks;
const treatDeleted = require('../../hooks/treat-deleted');

/**
 * special queries: forPatient: id
 * and "all:true"
 */
const special=async context=>{
  if(context.params.query && context.params.query.forPatient){
    console.log(1)
  }else if(context.params.query && context.params.query.all){
    console.log(2)
  }
}

const addImage=async context=>{
  const knex=context.app.get('knexClient')

  for(const sticker of context.result.data){
    const imageId=sticker.Image
    const image=await knex('dbimage').where("id",imageId)
    if(image && image.length>0){
      const imgdata=image[0].Bild
      sticker.imagedata=imgdata
    }
  }
  return context
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [treatDeleted()],
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
