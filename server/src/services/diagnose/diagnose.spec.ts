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
})
