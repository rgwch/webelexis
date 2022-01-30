/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
const app = require('../../dist/app');

xdescribe('\'auf\' service', () => {
  it('registered the service', () => {
    const service = app.service('auf');
    expect(service).toBeOk();
  });
});
