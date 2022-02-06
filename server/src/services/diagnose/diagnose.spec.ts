import app from '../../app'

describe("diagnose", () => {
  let service

  beforeAll(() => {
    service = app.service("diagnose")
  })
  it("registered the service", () => {
    expect(service).toBeTruthy()
  })
  it("fetches some diagnoses", async () => {
    const result = await service.fetch({})
    expect(result.total).toBeGreaterThan(0)
  })
})
