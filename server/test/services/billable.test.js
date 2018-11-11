const assert = require('assert');
const feathers = require('@feathersjs/feathers')
const createService = require('../../src/services/billable/billable.class')
const knex = require('feathers-knex');
const realApp=require('../../src/app')

const tarmed={
  name:'tarmed',
  Model: realApp.get('knexClient')
}

const article={
  name: "artikelstamm_ch",
  Model: realApp.get('knexClient')
}

class FallService {
  async get(id, params) {
    return {
      id: "007",
      gesetz: "KVG"
    }
  }
}


describe('\'billable\' service', () => {
  let app

  beforeEach(() => {
    app = feathers()
    app.use('/fall', new FallService())
    app.use('/billable', createService({ app: app }))
    app.use('/tarmed', knex(tarmed))
    app.use('/article', knex(article))
  })

  it('registered the service', () => {
    const service = app.service('billable');

    assert.ok(service, 'Registered the service');
  });

  it("fetches tarmed billings for a tarmed case", async () => {
    const service = app.service('billable');
    const billables = await service.find({
      query: {
        find: "kons",
        encounter: {
          fallid: "007",
          datum: "20181111"
        }
      }
    })
    console.log(billables)
  })
});
