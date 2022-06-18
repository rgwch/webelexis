import app from '../../test/app'
import couch from './couchdb.service'

app.configure(couch)

describe("CouchDB", () => {
  let service
  const database = "testdb"
  const testdoc = {
    _id: "test__",
    type: "testdoc",
    contents: "something"
  }

  beforeAll(() => {
    service = app.service("nosql")
  })

  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("creates, uses and deletes a database", async () => {
    const result = await service.create(testdoc, { query: { database } })
    expect(result._id).toEqual(testdoc._id)
    // expect(async () => { await service.create({ id: "testdb/Test", body: "anything" }) }).rejects.toThrow("Document update conflict")
    const retrieved = await service.get(testdoc._id, { query: { database } })
    expect(retrieved.contents).toEqual(testdoc.contents)
    const deleted = await service.remove(testdoc._id, { query: { database } })
    expect(deleted._id).toEqual(testdoc._id)
    const delDB = await service.remove("!database!", { query: { database } })
    expect(delDB.ok).toBeTruthy()
  })

  it("finds documents matching a query", async () => {
    const result = await service.create(testdoc, { query: { database } })
    expect(result._id).toEqual(testdoc._id)
    // expect(async () => { await service.create({ id: "testdb/Test", body: "anything" }) }).rejects.toThrow("Document update conflict")
    const retrieved = await service.find({ query: { database, type: "testdoc" } })
    expect(retrieved).toBeTruthy()
    expect(retrieved.data).toBeTruthy()
    expect(retrieved.data[0].contents).toEqual(testdoc.contents)
    const deleted = await service.remove(retrieved.data[0]._id, { query: { database } })
    expect(deleted._id).toEqual(testdoc._id)
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
