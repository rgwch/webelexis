import { ElexisUtils } from "./elexis-types";
const util = new ElexisUtils()

describe("Elexisutils", () => {
  it("creates and updates a VersionedResource", () => {
    const vr = util.createVersionedResource()
    const vr1 = util.updateVersionedResource(vr, "Added Text", "some remark")
    const entry = util.getVersionedResource(vr1)
    expect(entry).toBeTruthy()
    expect(entry.text).toEqual("Added Text")
    expect(entry.remark).toEqual("some remark")
    expect(entry.version).toEqual(0)

  })
  it("compresses and decompresses a string array", () => {
    const arr = ["eins", "zwei", "drei"]
    const comp = util.packStrings(arr)
    const upacked = util.unpackStrings(comp)
    expect(upacked).toEqual(arr)
  })

})
