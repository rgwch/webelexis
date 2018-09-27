/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const assert = require('assert');
const feathers = require('@feathersjs/feathers');
const returnConfig = require('../../src/hooks/return-config');

describe('\'return-config\' hook', () => {
  let app;

  beforeEach(() => {
    app = feathers();

    app.use('/dummy', {
      async get(id) {
        return { param: id,wert: "something" };
      }
    });

    app.service('dummy').hooks({
      after: returnConfig()
    });
  });

  it('runs the hook', async () => {
    const result = await app.service('dummy').get('test');
    
    assert.equal(result, "something");
  });
});
