/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
chai.should()
const assert = require('assert');
const app = require('../../src/app');

describe('\'patient\' service', () => {
  let service
  beforeEach(() => {
    service = app.service('patient');
  })
  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });
  it("fetches all patients with first name or last name like 'ab%'", async () => {
    return service.find({ query: { $find: "ab%" } }).then(result => {
      result.should.be.ok
      result.data.every(elem => {
        return elem.bezeichnung1.toLowerCase().startsWith("ab") ||
          elem.bezeichnung2.toLowerCase().startsWith("ab") ||
          elem.bezeichnung3.toLowerCase().startsWith("ab")
      }).should.be.true
    })
  })
  it("fetches all patients born in 1990", async () => {
    const result = await service.find({ query: { $find: "1990" } })
    result.should.be.ok
    result.data.every(elem => elem.geburtsdatum.startsWith("1990")).should.be.true

  })
  it("fetches all patients with birthday at 14th of february", async () => {
    const result = await service.find({ query: { $find: "14.2." } })
    result.should.be.ok
    result.data.every(elem => elem.geburtsdatum.endsWith("0214")).should.be.true

  })
  it("fetches all patients born on 14. Feb. 1968", () => {
    return service.find({ query: { $find: "14.02.1968" } }).then(result => {
      result.should.be.ok
      result.data.every(elem => elem.geburtsdatum === "19680214").should.be.true
    })
  })
  it("creates, updates and deletes a new patient", async () => {
    const pat = await service.create({ "bezeichnung1": "Meier", "bezeichnung2": "Huber" })
    pat.should.be.ok
    const found = await service.find({ query: { bezeichnung1: "Meier", bezeichnung2: "Huber" } })
    found.should.be.ok
    found.data.length.should.be.above(0)
    const foundpat = found.data[0]
    foundpat.id.length.should.equal(36)
    foundpat.geburtsdatum = "19700506"
    foundpat.geschlecht = "m"
    const lu=foundpat.lastupdate
    const jetzt=new Date().getTime();

    (jetzt-lu).should.be.lt(3000)
    // foundpat.lastupdate.should.be.closeTo(new Date().getTime(), 3000)
    const updated = await service.update(foundpat.id, foundpat)
    const del = await service.remove(foundpat.id)
    del.should.be.ok
    del.geschlecht.should.equal("m")
    del.geburtsdatum.should.equal("19700506")
    del.id.should.equal(foundpat.id)
    del.lastupdate.should.be.closeTo(new Date().getTime(), 3000)
    const config = app.service("elexis-config")
    const lastPatNr = (parseInt(await config.get('PatientNummer')) - 1).toString()
    config.update('PatientNummer', { wert: lastPatNr })
  })

});
