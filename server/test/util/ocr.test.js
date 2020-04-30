require('chai').should()
const path = require('path')
const ocr = require('../../src/util/ocr')
const fs=require('fs').promises

describe("ocr utility", () => {
  it('reads ad pdf and extracts text', async () => {
    const file=path.join(__dirname,"../sample_html.pdf")
    const cnt=await fs.readFile(file)
    const text=await ocr(cnt)
    text.should.be.ok
  })
})
