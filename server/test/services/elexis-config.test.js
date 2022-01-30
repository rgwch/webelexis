/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../dist/app');

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
