import app from '../../app'

describe("encounters", () => {
  let service;

  beforeAll(() => {
    service = app.service('konsultation')
  })
  afterAll(() => {
    delete app['knexClient']
  })

  it("registered the service", () => {
    expect(service).toBeTruthy()
  })

  it("fetches some encounters", async () => {
    const result = await service.find({ query: { $limit: 10 } })
    expect(result.total).toBeGreaterThan(0)
    const enc = result.data[0]
    expect(enc).toHaveProperty("eintrag")
  })

  xit('gets an ecounter by id', async () => {
    const result = await service.get("04c6bd576be743af82c4efceb")
    expect(result).toBeTruthy()
    expect(result).toHaveProperty("eintrag")
    expect(result.eintrag).toHaveProperty("html")
    expect(result.eintrag).toHaveProperty("delta")
  })
})
