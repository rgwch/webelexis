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
    expect(result.id).toEqual("testdb/Test")
    // expect(async () => { await service.create({ id: "testdb/Test", body: "anything" }) }).rejects.toThrow("Document update conflict")
    const retrieved = await service.get("testdb/Test")
    expect(retrieved.body).toEqual("something")
    const deleted = await service.remove("testdb/Test")
    expect(deleted.id).toEqual("testdb/Test")
    const delDB = await service.remove("testdb")
    expect(delDB.ok).toBeTruthy()
  })
})
