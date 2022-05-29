import app from '../../test/app'
import couch from './couchdb.service'

app.configure(couch)

describe("CouchDB", () => {
  let service
  const database = "testdb"
  const testdoc = {
    id: "test__",
    type: "testdoc",
    contents: "something"
  }

  beforeAll(() => {
    service = app.service("couchdb")
  })

  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("creates, uses and deletes a database", async () => {
    const result = await service.create(testdoc, { query: { database } })
    expect(result.id).toEqual(testdoc.id)
    // expect(async () => { await service.create({ id: "testdb/Test", body: "anything" }) }).rejects.toThrow("Document update conflict")
    const retrieved = await service.get(testdoc.id, { query: { database } })
    expect(retrieved.contents).toEqual(testdoc.contents)
    const deleted = await service.remove(testdoc.id, { query: { database } })
    expect(deleted.id).toEqual(testdoc.id)
    const delDB = await service.remove("", { query: { database } })
    expect(delDB.ok).toBeTruthy()
  })

  it("throws an error on nonexistent get ", async () => {
    try {
      await service.get("in_existent_id", { query: { database } })
      expect(false).toBeTruthy()
    } catch (err) {
      expect(err.message).toEqual("not_found")
    }
    try {
      await service.get("inexistent_db", { query: { database: "inexistent" } })
      expect(false).toBeTruthy()
    } catch (err) {
      expect(err.message).toEqual("not_found")
    }
  })
})
