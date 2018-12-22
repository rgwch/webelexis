const assert = require('assert');
const feathers = require('@feathersjs/feathers');
require('chai').should()
const flatiron = require('../../src/hooks/flatiron')({
  id: "id",
  obj: "obj",
  service: "rel"
})

const dummies = [{
  id: "1",
  name: "dummy1",
  relid: "r1"
}, {
  id: "2",
  name: "dummy2",
  relid: "r2"
}]

const relations = [{
  id: "r1",
  name: "relation1"
}, {
  id: "r2",
  name: "relation2"
}]
describe('flatiron hook', () => {
  let app;

  beforeEach(() => {
    app = feathers()
  })

  app.use('/service', {
    async get(id) {
      return dummies[0].id
    }
  })

  app.use('/rel',{
    async get(id){
      return relations.find(o=>o.id==id)
    }
  })
  app.service('service').hooks({
    before: flatiron,
    after: flatiron
  })

  it('folds the object after get',async ()=>{
    const result=await app.service('service').get("1")
    result.should.have.property('obj')
    result.obj.id.should.equal("r1")
    result.obj.name.should.equal("relation1");
  })

})
