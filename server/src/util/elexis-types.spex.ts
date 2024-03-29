/**
 * This test does not complete normally due to node-java lekaing.
 * 
 */
import { ElexisUtils } from "./elexis-types";
import fs from 'fs'
const util = new ElexisUtils()

describe("Elexisutils", () => {

  it("creates and modifies an extinfo field", () => {
    const input = {
      "1": "eins",
      "2": "zwei",
      "3": {
        "3.1": "Dreipunkt 1",
        "3.2": ["eins", "zwei", "drei"]
      },
      "4": [1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
    const extinfo = util.writeExtInfo(input)
    expect(extinfo).toBeTruthy()
    const extjson = util.getExtInfo(extinfo)
    expect(extjson).toEqual(input)
  })
  it("creates and updates a VersionedResource", () => {
    const vr = util.createVersionedResource()
    const vr1 = util.updateVersionedResource(vr, "Added Text", "some remark")
    const entry = util.getVersionedResource(vr1)
    expect(entry).toBeTruthy()
    expect(entry.text).toEqual("Added Text")
    expect(entry.remark).toEqual("some remark")
    expect(entry.version).toEqual(0)

  })

  /*
  it("compresses and decompresses a string array", () => {
    const arr = ["eins", "zwei", "drei"]
    const comp = util.packStrings(arr)
    const upacked = util.unpackStrings(comp)
    expect(upacked).toEqual(arr)
  })
  */
  /*
    it("decompresses an existing extinfo string", () => {
      const compressed = 'oAAASFBLAwQUAAgICAC9TCFUAAAAAAAAAAAAAAAABAAAAERhdGEzMNQzMNQzMjAy0lEwsLQyNrcytbRScMwpVghJLMpNTdENSk3OyCvNS1dILC1OKSpNzk7Ns1LwT0tLzVMozUtRSE8FC5YAAFBLBwjbqszFRwAAAEgAAABQSwECFAAUAAgICAC9TCFU26rMxUcAAABIAAAABAAAAAAAAAAAAAAAAAAAAAAARGF0YVBLBQYAAAAAAQABADIAAAB5AAAAAAA='
      const unpacked = util.unpackStringsFromString(compressed);
      expect(unpacked).toEqual(["01.01.2022, 09:37:59: Als Tarmed-Rechnung ausdrucken: Offen und gedruckt"])
    })
    */
  it("decodes a Date", () => {
    const date = new Date(2020, 2, 3)
    const parsed = util.dateStrings(date)
    expect(parsed.year).toEqual("2020")
    expect(parsed.month).toEqual("03")
    expect(parsed.day).toEqual("03")
  })

  it("creates a database format of a date", () => {
    const date = new Date(2021, 5, 14)
    const db = util.makeCompactFromDateObject(date)
    expect(db).toEqual("20210614")
  })

  it("creates a Date from a compact string", () => {
    const db = "20220215"
    const date = util.makeDateObjectFromCompact(db)
    expect(date).toEqual(new Date(2022, 1, 15))
  })

  it("creates a hh:mm string from a number of minutes", () => {
    const res = util.makeTime(990)
    expect(res).toEqual("16:30")
  })

  it("calculates minutes from a hh:mm string", () => {
    const res = util.makeMinutes("14:35")
    expect(res).toEqual(875)
  })

  it("creates an elexis-compatible password hash", () => {
    const result = util.hashPassword("topSecret", "1")
    expect(result.hashed).toEqual("deb55dc0c7e0998962dc4ce0fc6f58d835704d63")
  })

  it("adds an entry to a compressed string field", () => {
    const zipped = fs.readFileSync("./test/test4.bin")
    const rezipped = util.addEntryToPackedStrings(zipped, "Statusänderung", "__TEST__");
    const unzipped2 = util.getExtInfo(rezipped)
    const states2 = util.unpackStringsFromString(unzipped2["Statusänderung"])
    expect(Array.isArray(states2)).toBeTruthy()
    expect(states2).toContain("__TEST__");

  })
  /*
  it("expands an elexis extinfo entry", async () => {
    try {
      const zipped = fs.readFileSync("./test/test4.bin")
      const unzipped = util.getExtInfo(zipped)
      expect(unzipped).toBeTruthy()
      const states=unzipped["Statusänderung"]
      const unpacked=util.unpackStringsFromString(states)
      expect(Array.isArray(unpacked)).toBeTruthy()
      unpacked.push("__Test Entry__")
      const packed=Buffer.from(util.packStrings(unpacked))
      unzipped["Statusänderung"]=packed
      const rezipped=util.writeExtInfo(unzipped)

      const unzipped2=util.getExtInfo(rezipped)
      const states2=util.unpackStringsFromString(unzipped2["Statusänderung"])
      expect(Array.isArray(states2)).toBeTruthy()
      expect(states2).toContain("__Test Entry__");

    } catch (err) {
      throw (err)
    }
  })
  */
})
