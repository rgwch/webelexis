/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'createpdf\' service', () => {
  it('registered the service', () => {
    const service = app.service('createpdf');

    assert.ok(service, 'Registered the service');
  });
});
