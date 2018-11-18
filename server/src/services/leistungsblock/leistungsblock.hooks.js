const { authenticate } = require('@feathersjs/authentication').hooks;
const handleExtInfo=require('../../hooks/handle-extinfo')

const getElements=ctx=>{
  if(ctx.result){
    const leistungen=ctx.result.codeelements.split(/:=:/)
    ctx.result.billables=[]
    for(const l of leistungen){
      const [system,code,text]=l.split(/\s*\|\s*/)
      ctx.result.billables.push({system: system.toLowerCase(),code,text})
    }
  }
  return ctx
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  after: {
    all: [],
    find: [handleExtInfo({extinfo:'leistungen'})],
    get: [handleExtInfo({extinfo:'leistungen'}),getElements],
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
