import app from '../../test/app'
import couch from './couchdb.service'

app.configure(couch)

describe("CouchDB", () => {
  let service

  beforeAll(() => {
    service = app.service("couchdb")
  })

  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("creates, uses and deletes a database", async () => {
    const result = await service.create({ id: "testdb/Test", type: "testdoc", body: "something" })
    expect(result.ok).toBeTruthy()
    const retrieved = await service.get()
  })
})
