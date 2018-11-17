/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');
const chai = require('chai')
const should = chai.should()

xdescribe('\'elexis_config\' service', () => {
  let service;

  it('registered the service', () => {
    service = app.service('elexis-config');

    assert.ok(service, 'Registered the service');
  });
  it("loads a configuration variable", async () => {
    const ver = await service.get('dbversion')
    ver.startsWith("3.").should.be.ok

  })
});
