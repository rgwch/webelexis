const assert = require('assert');
const app = require('../../src/app');

describe('\'stickynotes\' service', () => {
  it('registered the service', () => {
    const service = app.service('stickynotes');

    assert.ok(service, 'Registered the service');
  });
});
