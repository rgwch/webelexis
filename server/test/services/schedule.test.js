const assert = require('assert');
const app = require('../../src/app');
require('chai').should()

describe('\'schedule\' service', () => {
  it('registered the service', () => {
    const service = app.service('schedule');

    assert.ok(service, 'Registered the service');
  });
  it("loads appointments", async () => {
    const sched = app.service('schedule')
    const agn = app.service('termin')
    const resources = await agn.get('resources')
    const found = await sched.find({ query: { date: "20190110", resource: resources[0] } })
    found.should.be.an(Array)
  })
});
