/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../src/app');

xdescribe('\'kontakt\' service', () => {
  const service = app.service('kontakt');

  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });
});
