/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
const should = chai.should()
const assert = require('assert');
const app = require('../../src/app');

describe('\'termin\' service', () => {
  let service
  beforeEach(() => {
    app.set("testing",true)
    service = app.service('termin')
  })
  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });
  it("loads and sort all appointments from 11.12.2017", async () => {
    return service.find({query:{ "Tag": "20171211" }}).then(termine => {
      termine.data.length.should.be.above(2)
      let check=termine.data.every(elem=>{
        return elem.Tag==="20171211"}
      )
      assert.ok(check)
      let begins=termine.data.map(t=>parseInt(t.Beginn))
      for(let i=0;i<termine.data.length-1;i++){
        (begins[i]<=begins[i+1]).should.be.true
      }
    })
  })
  it("loads the first appointment of 11.12.2017", async function(){
    let allApps=await service.find({query:{"Tag":"20171211"}})
    let id=allApps.data[0].ID
    let firstAppnt=await service.get(id)
    firstAppnt.should.not.be.undefined
    firstAppnt.Tag.should.be.equal("20171211")
    firstAppnt.TerminTyp.should.be.equal("Reserviert")
  })
  it("loads a list of appointment types", async function(){
    let types=await service.get("types")
    types.length.should.be.above(1)
  })
  it("loads a list of appointment states", async function(){
    let states=await service.get("states")
    states.should.not.be.undefined
    states.length.should.be.above(1)
  })
  it("loads a list of agenda resources", async function(){
    let resources=await service.get("resources")
    resources.length.should.be.above(1)
  })
  it("fetches day presets of first resource", async function(){
    let resources=await service.get("resources")
    let presets=await service.get("daydefaults",{"resource":resources[0]})
    presets.should.have.property("Mo")
  })
  it("fetches time presets for first resource", async function(){
    let resources=await service.get("resources")
    let presets=await service.get("timedefaults",{"resource":resources[0]})
    presets.should.have.property("std")
  })
  it("fetches type colors for first resource", async ()=>{
    let resources=await service.get("resources")
    let colors=await service.get("typecolors",{query:{"resource":resources[0]}})
    colors.should.be.ok
  })
  it("fetches status colors for first resource",async ()=>{
    let resources=await service.get("resources")
    let colors=await service.get("statecolors",{query:{"resource":resources[0]}})
    colors.should.be.ok
  })
});
