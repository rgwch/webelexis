const assert = require('assert');
require('chai').should()
const app = require('../../src/app');
const fs = require('fs')
const path = require('path')

/**
 * remove the x from xdescribe, if you have a working lucinda server
 */
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

  it("performs a global search", async () => {
    const result = await service.find({ "query": "contents:*", "offset": 0, "limit": 20 })
    result.should.be.ok
    result.status.should.equal("ok")
    result.numFound.should.be.gt(0)

  })

  it("fetches first document", async () => {
    const result = await service.find({ "query": "contents:*", "offset": 0, "limit": 5 })
    result.should.be.ok
    result.status.should.equal("ok")
    result.numFound.should.be.gt(0)
    const meta = result.docs[0]
    const id = meta.id
    const doc = await service.get(id)
    doc.should.be.ok
  })
  it("indexes a pdf file", async () => {
    const testfile = path.join(__dirname, "../test.pdf")
    const buffer = fs.readFileSync(testfile)
    const doc = {
      payload: buffer.toString("base64"),
      metadata: {
        some: "thing",
        filename: "test.pdf",
        filepath: "mocha/test.pdf"
      }
    }
    const created = await service.create(doc)
    created.should.be.ok
    created.should.equal("added")
    const queried = await service.find({ "query": "lorem ipsum" })
    queried.status.should.equal("ok")
    queried.docs.should.be.an('array')
    queried.docs.length.should.be.gt(0)
    const id = queried.docs[0].id
    const retrieved = await service.get(id)
    retrieved.should.be.ok
    const pdf = Buffer.from(retrieved)
    // pdf.should.equal(buffer)
    const deleted = await service.remove(id)
    deleted.should.equal("ok")
  })
});

