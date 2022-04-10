import { create, extract, check } from './ziptool'
import { randomBytes } from 'crypto'

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
})
