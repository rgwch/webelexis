/**
 * Make Sure, etcd server is running and reachable
 */

import app from '../../test/app'
import blob from './blob.service'
import {entity} from './blob.class'
import lucinda from '../lucinda/lucinda.service'
app.configure(lucinda)
app.configure(blob)

describe('Blob', () => {
  let service

  beforeAll(() => {
    service = app.service("blob")
  })


  it('registered the service', () => {
    expect(service).toBeTruthy()
  })

  it("stores, retrieves and deletes an entry", async () => {
    const id = "testblob"
    const blob:entity = { id, data: "Something" }
    const id2 = await service.create(blob)
    expect(id).toEqual(id2)
    const check = await service.get(id)
    expect(check).toEqual(blob)
    const previous = await service.update(id, { id, data: "other" })
    // expect(previous.blob).toEqual(blob)

    const updated = await service.get(id)
    expect(updated.data).toEqual("other")
    await service.remove(id)
    expect(async () => { await service.get(id) }).rejects.toThrow("Item not found")
  })

  it("creates an id if none given", async () => {
    const id = await service.create({ data: "A test" })
    expect(id).toBeTruthy()
    const got = await service.get(id)
    expect(got).toHaveProperty("id")
    expect(got.data).toEqual("A test")
    await service.remove(id)

  })
})
