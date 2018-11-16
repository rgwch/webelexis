const { authenticate } = require('@feathersjs/authentication').hooks;
const {DateTime} = require('luxon')

const adapter=async ctx=>{
  const type=ctx.data.type
  const adaptername=`./${type}-adapter`
  const adapter=require(adaptername)
  const billing=adapter.createBilling(ctx.data)
  const encounterService=ctx.app.service('konsultation')
  const encounter=await encounterService.get(ctx.data.encounter_id)
  const caseService=ctx.app.service('fall')
  const fall=caseService.get(encounter.fallid)
  let billingsystem=fall.extjson.billing
  if(!billingsystem){
    billingsystem=fall.gesetz
    if(!billingsystem){
      billingsystem="KVG"
    }
  }
  const now=DateTime.local().toFormat("yyyyLLdd")
  const knex=ctx.app.get('knexClient')
  let mul=knex('vk_preise').select('MULTIPLIKATOR')
    .where('typ',billingsystem)
    .andWhere('datum_von','<=',now)
    .andWhere('datum_bis','>=',now)
  if(!mul){
    mul=1.0
  }
  billing.VK_SCALE=mul
  billing.vk_preis=billing.VK_TP*mul
  ctx.data=billing
  return ctx
}

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [],
    get: [],
    create: [adapter],
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
