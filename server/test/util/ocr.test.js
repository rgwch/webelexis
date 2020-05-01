require('chai').should()
const path = require('path')
const ocr = require('../../src/util/ocr')
const fs=require('fs').promises

xdescribe("ocr utility", () => {
  it('reads ad pdf and extracts text', async () => {
    const file=path.join(__dirname,"../ocrtest.pdf")
    const cnt=await fs.readFile(file)
    const text=await ocr(cnt)
    text.should.be.ok
    const res=await fs.writeFile(path.join(__dirname,"../ocrtested.pdf"),text)
  })
})
