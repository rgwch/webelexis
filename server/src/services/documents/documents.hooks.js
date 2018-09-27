const { authenticate } = require('@feathersjs/authentication').hooks;
const logger = require('winston');
logger.level="debug"

const expandDocFields= async (service,doc)=>{
  if(doc.concern){
    doc.concern=await service.get(doc.concern)
  }
  if(doc.addressee){
    doc.addressee=await service.get(doc.addressee)
  }
  return doc
}
const expandAllFields=async context=>{
  const contactService=context.app.service("kontakt")
  if(context.result && context.result.data){
    const docs=[]
    for(let doc of context.result.data){
      docs.push(expandDocFields(contactService,doc))
    }
    const converted=await Promise.all(docs)
    context.result.data=converted
    return context
  }
}

const expandSingleFields=async context=>{
  const contactService=context.app.service("kontakt")
  if(context.result){
    await expandDocFields(contactService,context.result)
    return context
  }
}

const reduceAllFields=context=>{
  logger.debug("reduce")
  if(context.data){
    if(typeof context.data.concern == 'object'){
      context.data.concern=context.data.concern.id
    }
    if(typeof context.data.addressee == 'object'){
      context.data.addressee = context.data.addressee.id
    }
    return context
  }

}
/*
const replaceSingleDocFields=async context=>{
  const contactService=context.app.service("kontakt")

}
*/
module.exports = {
  before: {
    all: [ /* authenticate('jwt') */],
    find: [],
    get: [],
    create: [reduceAllFields],
    update: [reduceAllFields],
    patch: [reduceAllFields],
    remove: []
  },

  after: {
    all: [],
    find: [expandAllFields],
    get: [expandSingleFields],
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
