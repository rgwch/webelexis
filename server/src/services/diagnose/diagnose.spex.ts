import { configure } from '../../launcher'

describe('diagnose', () => {
  let service, app

  function delay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 100)
    })
  }

  beforeAll(async () => {
    app = await configure()
    service = app.service('diagnose')
    await delay()
  })
  afterAll(() => {
    delete app["knexClient"]
  })
  it('registered the service', () => {
    expect(service).toBeTruthy()
  })
  it('fetches some diagnoses', async () => {
    const result = await service.find({})
    expect(result.total).toBeGreaterThan(0)
  })
  it('finds diagnoses matching an encounter', async () => {
    const knex = app.get('knexClient')
    const dg = await knex('behdl_dg_joint').where("deleted", "0").limit(1).select('behandlungsid')
    const konsid = dg[0].behandlungsid
    const diags = await service.find({ query: { konsid } })
    expect(diags.total).toBeGreaterThan(0)
  })
})
