const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'bills\' service', () => {
  it('registered the service', () => {
    const service = app.service('bills');

    assert.ok(service, 'Registered the service');
  });
});
