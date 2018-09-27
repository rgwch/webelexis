/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const chai = require('chai')
const should = chai.should()
const assert = require('assert');
const app = require('../../src/app');

describe('\'users\' service', () => {
  it('registered the service', () => {
    const service = app.service('users');

    assert.ok(service, 'Registered the service');
  });
  it('loads user with username gerry', () => {
    const service = app.service('users');

    return service.get('gerry').then(result => {
      result.IS_ACTIVE.should.be.equal("1")
      result.kontakt.should.exist
      result.kontakt.Bezeichnung1.should.be.equal("Weirich")
    })
  })
});
