const assert = require('assert');
const app = require('../../src/app');

describe('\'stickers\' service', () => {
  it('registered the service', () => {
    const service = app.service('stickers');

    assert.ok(service, 'Registered the service');
  });
});
