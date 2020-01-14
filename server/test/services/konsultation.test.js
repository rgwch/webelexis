/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

require('chai').should()
const assert = require('assert');
const app = require('../../src/app');
const fs = require('fs')
const path = require('path')
const Samdas = require('@rgwch/samdastools')
const elexistools = new (require('../../src/util/elexis-types'))()


describe('\'konsultation\' service', () => {
  let service;
  beforeEach(() => {
    service = app.service('konsultation');
  })
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it("fetches all encounters of first patient with first name or last name like 'test%'.", () => {
    const patients = app.service('patient')
    patients.find({ query: { $find: "test%" } }).then(pats => {
      pats.should.be.ok
      pats.data.should.not.be.empty
      const pat = pats.data[0]
      const id = pat.id
      id.should.be.a('string')
      return service.find({ query: { patientId: id, $limit: 10, $skip: 5 } }).then(konsen => {
        konsen.should.be.ok
        konsen.data.should.not.be.empty
        konsen.data[0].datum.should.not.be.empty

      })
    })
  })
  xit("retrieves all encounters in a paged return", async () => {
    const patients = app.service('patient')
    const cases = app.service("fall")
    const pats = await patients.find({ query: { Bezeichnung1: 'unittest' } })
    pats.should.be.ok
    pats.data.length.should.equal(1)
    const ut = pats.data[0]
    let skip = 0
    let consen = []
    let count
    const faelle = await cases.find({ query: { patientid: ut.id } })
    do {
      const batch = await service.find({ query: { patientId: ut.id, $limit: 20, $skip: skip } })
      count = batch.data.length
      skip += count
      consen = consen.concat(batch.data)
    } while (count > 0)
    let dat = consen[0].datum
    consen.forEach(kons => {
      const cnt = Buffer.from(kons.eintrag.delta)
      const fname = path.join(__dirname, "konsen", kons.datum + ".xml")
      fs.writeFileSync(fname, Samdas.fromDelta(cnt), { encoding: "utf8" })
      // (kons.datum<=dat).should.be.true
      //faelle.data.some(fall=>fall.id==kons.fallid).should.be.true
    })
  })
  it("fetches all encounters of all patients of a given period", async () => {
    const from="20181101"
    const until="20181231"
    const konsen = await service.find({ query: { $and: [{ datum: { $gte: from } }, { datum: { $lte: until } }] } })
    konsen.should.be.ok
    konsen.data.should.be.ok
    konsen.data.should.be.an('array')
    konsen.data.length.should.be.gt(0)
  })
  it("creates, updates and deletes an Encounter", async () => {
    await service.remove(null, { query: { fallid: "fallid" } })
    const empty = elexistools.createVersionedResource()
    const entry = elexistools.updateVersionedResource(empty, "Abrakadabra", "Unittest")
    const kons = {
      fallid: "fallid",
      mandantid: "mandantid",
      eintrag: {
        html: "<p>Abrakadabra</p>",
        remark: "Unittest"
      },
      datum: "20180101"
    }
    const created = await service.create(kons)
    created.should.have.property('id')
    created.id.should.be.ok
    created.fallid.should.equal("fallid")
    const filtered = await service.find({ query: { fallid: "fallid" } })
    filtered.data.should.be.ok
    filtered.data.length.should.equal(1)
    const fkons = filtered.data[0]
    fkons.should.have.property('id')
    fkons.id.should.equal(created.id)
    fkons.should.have.property('eintrag')
    fkons.eintrag.should.have.property('html')
    fkons.eintrag.html.should.be.ok
    fkons.eintrag.html.should.equal('Abrakadabra<br />')
    fkons.eintrag.remark.should.equal("Unittest")
    fkons.eintrag.html = '<span style="font-weight:bold;">Simsalabim</span>'
    const updated = await service.update(fkons.id, fkons)
    updated.id.should.equal(created.id)
    const filtered2 = await service.find({ query: { fallid: "fallid" } })
    filtered2.data.should.be.ok
    filtered2.data.length.should.equal(1)
    const fkons2 = filtered2.data[0]
    fkons2.id.should.equal(created.id)
    fkons2.eintrag.html.should.be.ok
    fkons2.eintrag.html.should.equal('<strong>Simsalabim</strong>')
    fkons2.eintrag.remark.should.equal("Unittest")
    const deleted = await service.remove(fkons2.id)
    deleted.id.should.equal(created.id)
  })
});
