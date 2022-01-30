/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'admin\' service', () => {
  it('registered the service', () => {
    const service = app.service('admin');

    assert.ok(service, 'Registered the service');
  });
});
