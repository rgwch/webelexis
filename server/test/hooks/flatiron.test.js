const assert = require('assert');
const feathers = require('@feathersjs/feathers');
require('chai').should()
const flatiron = require('../../src/hooks/flatiron')([{
  id: "relid",
  obj: "obj",
  service: "rel"
}])

const dummies = [{
  id: "1",
  name: "dummy1",
  relid: "r1",
  dummy: true
}, {
  id: "2",
  name: "dummy2",
  relid: "r2",
  dummy: true
}]

const relations = [{
  id: "r1",
  name: "relation1"
}, {
  id: "r2",
  name: "relation2"
}]
describe('flatiron hook', () => {
  let app
  let service

  beforeEach(() => {
    app = feathers();
    app.use('/service', {
      async get(id) {
        return dummies[0]
      },
      async find(data){
        return {
          total: 2,
          data: dummies,
          skip:0
        }
      },
      async create(data){
        if(Array.isArray(data)){
          dummies.push(...data)
        }else{
          dummies.push(data)
        }
        return data
      },
      async update(id,data){
        const obj=this.find(id)
        return data
      }
    })

    app.use('/rel', {
      async get(id) {
        const result = relations.find(o => o.id == id)
        return result
      }
    })
    service = app.service('service')
    service.hooks({
      before: {
        create: flatiron,
        update: flatiron,
        patch: flatiron
      },
      after: {
        get: flatiron,
        find: flatiron
      }
    })
  })


  it('folds the object after get', async () => {
    const result = await service.get("1")
    result.should.have.property('obj')
    result.obj.id.should.equal("r1")
    result.obj.name.should.equal("relation1");
  })

  it('folds several objects after find', async () => {
    const result = await service.find({ query: { dummy: true } })
    result.data.length.should.equal(2)
    result.data[0].should.have.property('obj')
    result.data[0].obj.id.should.equal('r1')
    result.data[0].obj.name.should.equal('relation1')
    result.data[1].should.have.property('obj')
    result.data[1].obj.id.should.equal('r2')
    result.data[1].obj.name.should.equal('relation2')

  })

  it('removes folded field on create', async ()=>{
    const res=await service.get("1")
    const result=Object.assign({},res)
    result.id="3"
    delete result.relid
    const created=await service.create(result)
    created.should.have.property('relid')
    created.relid.should.equal(result.relid)
    created.should.not.have.property('obj')
  })

  it('removes folded field on update', async()=>{
    const result=await service.get("1")
    result.name="updated"
    const updated=await service.update("1",result)
    updated.should.have.property('relid')
    updated.relid.should.equal(result.relid)
    updated.should.not.have.property('obj')
  })
})
