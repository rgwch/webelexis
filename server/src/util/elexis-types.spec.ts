import { ElexisUtils } from "./elexis-types";
const util=new ElexisUtils()

describe("Elexisutils",()=>{
  it("compresses and decompresses a string array",()=>{
    const arr=["eins","zwei","drei"]
    const comp=util.packStrings(arr)
    const upacked=util.unpackStrings(comp)
    expect(upacked).toEqual(arr)
  })

})