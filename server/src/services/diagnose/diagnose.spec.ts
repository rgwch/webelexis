import app from '../../app'

describe('diagnose', () => {
  let service

  function delay() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(true)
      }, 100)
    })
  }

  beforeAll(async () => {
    service = app.service('diagnose')
    await delay()
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
    const dg = await knex('behdl_dg_joint').where("deleted","0").limit(1).select('behandlungsid')
    const konsid = dg[0].behandlungsid
    const diags = await service.find({ query: { konsid } })
    expect(diags.total).toBeGreaterThan(0)
  })
})
