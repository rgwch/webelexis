const assert = require('assert');
require('chai').should()
const app = require('../../src/app');
const fs=require('fs')
const path=require('path')

describe('\'lucinda\' service', () => {
  let service

  before(() => {
    service = app.service('lucinda');
  })

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });

  it("tests server availability", async () => {
    const pong = await service.get("info")
    pong.should.be.a('string')
    pong.should.include('Lucinda')
  })

  it("indexes a pdf file", async () => {
    const testfile=path.join(__dirname,"../test.pdf")
    const buffer=fs.readFileSync(testfile)
    const doc={
      payload: buffer.toString("base64"),
      some: "thing"
    }
    const created=await service.create(doc)
    created.should.be.ok
    created.should.have.property("statusCode")
    assert(created.statusCode==200,"Statuscode is 200")
    const result=created.body
    result.status.should.equal("ok")
    result._id.should.be.a('string')
    const retrieved= await service.get(result._id)
    retrieved.should.be.ok
  })
});
