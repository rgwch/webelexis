/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const app = require('../../src/app');
const should=require('chai').should()
const fs=require('fs')
const path=require('path')

/* xx */ xdescribe('\'documents\' service', () => {
  beforeEach(async ()=>{
    const service=app.service('documents')
    await service.remove(null,{query: {subject: "a test"}})
  })

  it('registered the service', () => {
    const service = app.service('documents');

    assert.ok(service, 'Registered the service');
  });
  it('creates, modifies, loads and deletes a document',async ()=>{
    const service = app.service('documents');
    const contactservice=app.service('kontakt')
    const pats=await contactservice.find({query: {$find: "%test%"}})
    pats.data.should.be.ok
    pats.data.length.should.be.gt(1)
    const pat=pats.data[0]
    const adr=pats.data[1]
    const doc={
      concern: pat,
      addressee: adr,
      subject: "a test",
      type: "documents",
      template: null,
      category: "tests",
      contents: "<h1>Lorem Ipsum</h1><p>Perseveratur ut liquidum</p>"
    }
    const created=await service.create(doc)
    created.should.have.property('id')
    created.deleted.should.equal('0')
    created.should.have.property('lastupdate')
    created.contents.should.equal(doc.contents)
    created.concern.should.equal(pat.id)
    created.addressee.should.equal(adr.id)
    const found=await service.get(created.id)
    found.concern.should.deep.equal(pat)
    found.addressee.should.deep.equal(adr)
    found.contents="<h1>Modified</h1>"
    const updated=await service.update(found.id,Object.assign({},found))
    updated.id.should.equal(created.id)
    updated.concern.should.equal(pat.id)
    updated.addressee.should.equal(adr.id)
    const list=await service.find({query: {concern: pat.id}})
    list.should.be.ok
    list.data.length.should.be.gt(0)
    delete found.lastupdate
    delete list.data[0].lastupdate
    list.data[0].should.deep.equal(found)
  })
  xit("creates a pdf from a template and a document",async ()=>{
    const service = app.service('documents');
    const contactservice=app.service('kontakt')
    const pats=await contactservice.find({query: {$find: "test%"}})
    pats.data.should.be.ok
    pats.data.length.should.be.gt(1)
    const pat=pats.data[0]
    const adr=pats.data[1]
    const doc={
      concern: pat,
      addressee: adr,
      subject: "a test",
      type: "doc",
      template: null,
      contents: "<h1>Lorem Ipsum</h1><p>Perseveratur ut liquidmum</p>"
    }
    const created=await service.create(doc)
    //const template=fs.readFileSync(path.join(__dirname,"../../src/services/documents/example-template.html"))
    //const compiled=await service.toPDF(template.toString(),created)
  })
});
