const fs = require('fs').promises
const pdfocr = require('pdf-ocr')
const tmp = require('tmp-promise')

module.exports = cnt => {
  return new Promise(async (resolve, reject) => {
    const { fd, path, cleanup } = await tmp.file()
    const rs = await fs.writeFile(path, cnt)
    const processor = pdfocr(path, { type: 'ocr' }, err => {
      if (err) {
        reject(err)
      }
    })
    processor.on('complete', data => {
      resolve(data.textPages)
    })
    processor.on('error', err => {
      reject(err)
    })
  })



}
