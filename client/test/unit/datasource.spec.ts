import { LocalDataSource, LocalDataService } from '../../src/services/dataservice';
import { IElexisType } from 'models/elexistype';
import { Fakes } from '../../src/services/fakes'
import { IKontakt } from 'models/kontakt-model';

describe('check datasource', () => {
  const faker = new Fakes()
  const dsource = new LocalDataSource()

  beforeAll(() => {
    localStorage.clear();
  })

  it('should load a ds for IUser', async done => {
    const ds = dsource.getService("user")
    const dummy = await faker.getKontakt("123")
    const dummy2 = await ds.create(dummy)
    const dummy3 = await ds.get("123")
    expect(dummy3.id).toBe("123")
    expect(dummy3).toEqual(dummy)
    done()
  })
  it('should update an existing entry', async done => {
    const ds = dsource.getService("user")
    const dummy = await faker.getKontakt("456")
    await ds.create(dummy)
    const test = await ds.get(dummy.id)
    test["titel"] = "Professor"
    const test2 = await ds.update(test.id, test)
    expect(test2["titel"]).toBe("Professor")
    const test3 = await ds.get(dummy.id)
    expect(test3["titel"]).toBe("Professor")
    expect(test3["bezeichnung1"]).toEqual(dummy["bezeichnung1"])
    done()
  })
  it("should patch an entry", async done => {
    const ds = dsource.getService("user")
    const dummy = await faker.getKontakt("456")
    await ds.create(dummy)
    const test = await ds.get(dummy.id)
    const test2=await ds.patch(test.id,{"ping":"pong"})
    const test3=await ds.get(dummy.id)
    expect(test3["ping"]).toEqual("pong")
    expect(test3["bezeichnung2"]).toEqual(dummy["bezeichnung2"])
    done();
  })

  it("should remove an entry", async done=>{
    const ds = dsource.getService("user")
    const dummy = await faker.getKontakt("456")
    await ds.create(dummy)
    const test = await ds.get(dummy.id)
    const test2=await ds.remove(dummy.id)
    expect(test2.id).toEqual(dummy.id)
    expect(test2["bezeichnung1"]).toEqual(dummy["bezeichnung1"])
    try{
      await ds.get(dummy.id)
      fail("should not be here - delete not successful")
    }catch(ex){
      done()
    }
  })
})
