/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
const should = chai.should()
const assert = require('assert');
const app = require('../../src/app');
let user;

beforeEach(async () => {
    const usrs = app.service('user')
    const list = await usrs.find()
    user = list.data[0].id
})
describe('\'termin\' service', () => {
    let service

    beforeEach(() => {
        app.set("testing", true)
        service = app.service('termin')
    })
    it('registered the service', () => {

        assert.ok(service, 'Registered the service');
    });
    it("loads some batches of appointments", async ()=>{
      const termine=await service.find({query: {"tag": {$gt: "20200101", $lt: "20200229"}}})
      termine.data.length.should.equal(50)
      termine.total.should.be.above(50)
      const t2=await service.find({query: {"tag": {$gt: "20200101", $lt: "20200229"},$skip:50}})
      termine.skip.should.be(50)
    })
    it("loads and sort all appointments from 11.12.2017", async () => {
        const termine = await service.find({ query: { "tag": "20171211" } })
        termine.data.length.should.be.above(2)
        let check = termine.data.every(elem => {
            return elem.tag === "20171211"
        }
        )
        assert.ok(check)
        let begins = termine.data.map(t => parseInt(t.beginn))
        for (let i = 0; i < termine.data.length - 1; i++) {
            (begins[i] <= begins[i + 1]).should.be.true
        }

    })
    it("loads the first appointment of 11.12.2017", async function() {
        let allApps = await service.find({ query: { "tag": "20171211" } })
        let id = allApps.data[0].id
        let firstAppnt = await service.get(id)
        firstAppnt.should.not.be.undefined
        firstAppnt.tag.should.be.equal("20171211")
        firstAppnt.termintyp.should.be.equal("Reserviert")
    })
    it("loads a list of appointment types", async function() {
        let types = await service.get("types")
        types.length.should.be.above(1)
    })
    it("loads a list of appointment states", async function() {
        let states = await service.get("states")
        states.should.not.be.undefined
        states.length.should.be.above(1)
    })
    it("loads a list of agenda resources", async function() {
        let resources = await service.get("resources")
        resources.length.should.be.above(1)
    })
    it("fetches day presets of first resource", async function() {
        let resources = await service.get("resources")
        let presets = await service.get("daydefaults", { "resource": resources[0] })
        presets.should.have.property("Mo")
    })
    xit("fetches time presets for first resource", async function() {
        let resources = await service.get("resources")
        let presets = await service.get("timedefaults", { "resource": resources[0] })
        presets.should.have.property("std")
    })
    it("fetches type colors for first resource", async () => {
        let resources = await service.get("resources")
        let colors = await service.get("typecolors", { query: { "user": user } })
        colors.should.be.ok
    })
    it("fetches status colors for first resource", async () => {
        let resources = await service.get("resources")
        let colors = await service.get("statecolors", { query: { "user": user } })
        colors.should.be.ok
    })
    it("cleans an entry before create, update or patch",async ()=>{
      let dummy={
        patid:"007",
        bereich:"somewhere",
        tag: "20181010",
        beginn: "700",
        dauer: "10",
        grund: "Keine Ahnung",
        termintyp: "DummyTermin",
        terminstatus: "unnötig",
        erstelltvon:"unittest",
        falsch: "should be eliminated"
      }
      let created=await service.create(dummy)
      created.id.should.be.ok
      created.should.not.have.property('falsch')
      created.wrong="bad field"
      let updated=await service.update(created.id,created)
      updated.should.not.have.property('wrong')
      updated.should.have.property('deleted')
      await service.remove(created.id)
    })
});
