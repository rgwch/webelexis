/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const app = require('../../src/app');
const should = require('chai').should()
const fs = require('fs')
const path = require('path')

/**
 * This text expects a running solr instance with a core 'elexisdata'
 * configured in config/default.json
*/
describe('\'documents\' service', () => {
  const service = app.service('documents')

  beforeEach(async () => {
    try {
      await service.remove(null, { query: {subject: "test" }})
    } catch (err) {
      console.log(err)
      // doesn't matter
    }
  })

  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  xit('creates, modifies, loads and deletes a document', async () => {
    const service = app.service('documents');
    const contactservice = app.service('kontakt')
    const pats = await contactservice.find({ query: { $find: "%test%" } })
    pats.data.should.be.ok
    pats.data.length.should.be.gt(1)
    const pat = pats.data[0]
    const adr = pats.data[1]
    const doc = {
      concern: pat.id,
      addressee: adr.id,
      subject: "test",
      type: "documents",
      template: null,
      category: "tests",
      contents: "<h1>Lorem Ipsum</h1><p>Perseveratur ut liquidum</p>"
    }
    const created = await service.create(doc)
    created.should.have.property('id')
    created.deleted.should.equal('0')
    created.should.have.property('lastupdate')
    created.contents[0].should.equal(doc.contents)
    created.concern.should.equal(pat.id)
    created.addressee[0].should.equal(adr.id)
    const found = await service.get(created.id)
    found.concern.should.equal(pat.id)
    found.addressee[0].should.equal(adr.id)
    found.contents[0] = "<h1>Modified</h1>"
    found._version_ = 0
    const updated = await service.update(found.id, Object.assign({}, found))
    updated.id.should.equal(created.id)
    updated.concern.should.equal(pat.id)
    updated.addressee[0].should.equal(adr.id)
    const list = await service.find({ query: { $search: "concern:"+pat.id } })
    list.should.be.ok
    list.length.should.be.gt(0)
    const lucene = await service.find({ query: { $search: "contents:lor*" } })
    lucene.should.be.ok
    lucene.length.should.equal(0)
    // const empty=await service.find({query: {$search: "alpha:beta"}})
    // empty.should.be.ok
    // empty.data.length.should.equal(0)
    const exists = await service.find({ query: { $search: "contents:mod*" } })
    exists.should.be.ok
    exists.length.should.be.gt(0)

  })
  it("creates an entry from a odt document", async () => {
    const p = path.join(__dirname, "../test.odt")
    const result = await service.create({ contents: "file://" + p,subject: "test" })
    result.should.be.ok

  })
  it("creates an entry from a remote file", async () => {
    const result = await service.create({ contents: "http://www.elexis.ch/ungrad", filename: "Elexis_Ungrad.html", subject: "test" })
    result.should.be.ok
  })
  it("indexes a file in-place", async()=>{
    const result=await service.create({contents: "http://www.google.ch", filname: "google", subject: "test"},{inPlace: true})
    result.should.be.ok
  })

  xit("deletes a file",async ()=>{
    const p = path.join(__dirname, "../test.odt")
    const result = await service.create({ contents: "file://" + p, filename: "doomed.odt", subject: "test" })
    result.should.be.ok
    const removed=await service.remove(result.id)
    removed.should.be.ok
  })
  xit("creates a pdf from a template and a document", async () => {
    const service = app.service('documents');
    const contactservice = app.service('kontakt')
    const pats = await contactservice.find({ query: { $find: "test%" } })
    pats.data.should.be.ok
    pats.data.length.should.be.gt(1)
    const pat = pats.data[0]
    const adr = pats.data[1]
    const doc = {
      concern: pat,
      addressee: adr,
      subject: "a test",
      type: "doc",
      template: null,
      contents: "<h1>Lorem Ipsum</h1><p>Perseveratur ut liquidmum</p>"
    }
    const created = await service.create(doc)
    //const template=fs.readFileSync(path.join(__dirname,"../../src/services/documents/example-template.html"))
    //const compiled=await service.toPDF(template.toString(),created)
  })
});
