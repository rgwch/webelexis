import app from '../../test/app'
import blob from './blob.service'
app.configure(blob)

describe('Blob',()=>{
  let service

  beforeAll(()=>{
    service=app.service("blob")
  })

  afterAll(()=>{
    delete app["knexClient"]
  })

  it('registered the service',()=>{
    expect(service).toBeTruthy()
  })

  it("stores, retrieves and deletes an entry",async ()=>{
    const blob="Something"
    const id=await service.create({blob})
    expect(id).toBeTruthy()
    const check=await service.get(id)
    expect(check.blob).toEqual(blob)
    const previous=await service.update(id,{id,blob:"other"})
    // expect(previous.blob).toEqual(blob)
    
    const updated=await service.get(id)
    expect(updated.blob).toEqual("other")
    await service.remove(id)
    expect(await service.get(id)).toBeFalsy()
  
  })
})