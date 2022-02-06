const app = require('../../src/app');

describe('\'diagnose\' service', () => {
  it('registered the service', () => {
    const service = app.service('diagnose');
    expect(service).toBeTruthy();
  });
});
