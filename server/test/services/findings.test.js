const assert = require('assert');
const app = require('../../dist/app');

xdescribe('\'findings\' service', () => {
  const service = app.service('findings');

  it('registered the service', () => {
  
    assert.ok(service, 'Registered the service');
  });
});
