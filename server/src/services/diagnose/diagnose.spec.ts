// import app from '../../app'

xdescribe("diagnose", () => {
  let service

  beforeAll(() => {
    // service = app.service("kontakt")
  })
  it("registered the service", () => {
    expect(service).toBeTruthy()
  })
  xit("fetches some diagnoses", async () => {
    const result = await service.fetch({})
    expect(result.total).toBeGreaterThan(0)
  })
})
