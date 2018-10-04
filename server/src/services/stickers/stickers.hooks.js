const { authenticate } = require('@feathersjs/authentication').hooks;

/**
 * special queries: forPatient: id
 * and "all:true"
 */
special=async context=>{
  if(context.params.query && context.params.query.forPatient){

  }else if(context.params.query && context.params.query.all){
    
  }
}


module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [special],
    get: [],
    create: [],
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
