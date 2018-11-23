/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const assert = require('assert');
const app = require('../../src/app');

describe('\'auf\' service', () => {
  it('registered the service', () => {
    const service = app.service('auf');

    assert.ok(service, 'Registered the service');
  });
});
