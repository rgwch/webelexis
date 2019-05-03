/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
chai.should()
const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'user\' service', () => {
  it('registered the service', () => {
    const service = app.service('user');

    assert.ok(service, 'Registered the service');
  });
  it('loads user with username test', () => {
    const service = app.service('user');

    return service.get('test').then(result => {
      result.is_active.should.be.equal("1")
      result.should.have.property("_Kontakt")
      result.roles.should.exist
      Array.isArray(result.roles).should.be.ok
    })
  })
});
