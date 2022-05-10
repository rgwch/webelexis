import { create, extract, check, encrypt, decrypt } from './ziptool'
import { randomBytes } from 'crypto'
import fs from 'fs'

describe("Ziptool", () => {
  it("compresses and expands an entity", async () => {
    const input = "A Sample input string"
    const zipped = await create("test", input)
    const output = await extract(zipped, "test")
    expect(output).toEqual(input)
  })

  it("performs self test", async () => {
    const input = randomBytes(1000).toString("utf-8")
    const result = await check(input)
    expect(result).toEqual(input)
  })

  it("encrypts and decrypts a text",async ()=>{
    const input = randomBytes(1000).toString("utf-8")
    const result=await encrypt(input,"TopSecret", "Salt")
    const decrypted=await decrypt(result,"TopSecret","Salt")
    expect(decrypted).toEqual(input)
  })
  xit("expands an elexis extinfo entry", async () => {
    try {
      const zipped = fs.readFileSync("./test/test4.bin")
      const unzipped = await extract(zipped, "")
      expect(unzipped).toBeTruthy()
    } catch (err) {
      throw (err)
    }
  })
})
