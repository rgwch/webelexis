/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'kontakt\' service', () => {
  const service = app.service('kontakt');

  it('registered the service', () => {

    assert.ok(service, 'Registered the service');
  });
});
