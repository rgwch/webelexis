import { LocalDataSource,LocalDataService } from './../../src/services/dataservice';
describe('check datasource', ()=>{
  it('should load a ds for IUser', async done =>{
    const dsource=new LocalDataSource()
    const ds=dsource.getService("user")
    const dummy=await ds.get("123")
    expect(dummy.id).toBe("123")
    console.log(dummy)
    done()
  })
})
