const app = require('../../src/app');

describe('\'invoice\' service', () => {
  it('registered the service', () => {
    const service = app.service('invoice');
    expect(service).toBeTruthy();
  });
});
