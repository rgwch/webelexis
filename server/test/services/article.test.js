/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
const should = chai.should()
const assert = require('assert');
const app = require('../../src/app');

describe('\'article\' service', () => {
  let service;
  beforeEach(()=>{
    service = app.service('article');
  })
  it('registered the service', () => {
    assert.ok(service, 'Registered the service');
  });
  it("loads articles like 'ab%'",()=>{
    return service.find({query:{dscr:{$like: "ab%"}}}).then(result=>{
      result.should.be.ok
      //result.data.every(article=>article.bb==="0").should.be.true
      result.data.every(article=>article.dscr.toLowerCase().startsWith("ab")).should.be.true
      return "ok"
    })
  })
  it("loads diclofenac generics from Spirig",()=>{
    return service.find({query:{dscr:{$like: "diclofenac"},comp_name: {$like: "spirig%"}, generic_type:"G"}}).then(result=>{
      result.should.be.ok
      result.data.every(art=>art.COMP_GLN==="7601001394834" && /Diclofenac/.test(art.DSCR)).should.be.true
      return "ok"
    })
  })
});
