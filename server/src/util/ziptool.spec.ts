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

  it("encrypts and decrypts binary data", async () => {
    const input = randomBytes(1000)
    const result = await encrypt(input, "TopSecret", "Salt")
    const decrypted = await decrypt(result, "TopSecret", "Salt")
    expect(decrypted).toEqual(input)
  })
  it("fails on bad password", async () => {
    const input = randomBytes(1000)
    const result = await encrypt(input, "TopSecret", "Salt")
    return expect(() => decrypt(result, "TopSecre", "Salt")).rejects.toMatch(/pipeline Error.+/)
  })
  it("fails on bad salt", async () => {
    const input = randomBytes(1000)
    const result = await encrypt(input, "TopSecret", "SomeSaltySalt")
    return expect(() => decrypt(result, "TopSecret", "SomeSaltySalz")).rejects.toMatch(/pipeline Error.+/)
  })
  it("encrypts and decrypts a string", async () => {
    const test = "Something"
    const input = Buffer.from(test, "utf-8")
    const encrypted = await encrypt(input, "TopSecret", "Salty Stuff")
    const intermediate = encrypted.toString("base64")
    const reBuffer = Buffer.from(intermediate, "base64")
    const decrypted = await decrypt(reBuffer, "TopSecret", "Salty Stuff")
    const result = decrypted.toString("utf-8")
    expect(test).toEqual(result)
  })
})
