const fetch = require('node-fetch')
import { logger as log } from '../logger'

export default cnt => {
  return new Promise(async (resolve, reject) => {
    log.debug("sending file to ocr")
    const response = await fetch('http://localhost:9997', {
      method: 'post',
      headers: {
        "content-type": "application/octet-stream",
        "accept": "application/octet-stream"
      }, body: cnt
    })
    log.info("OCR clear")
    if (response.status == 200) {
      console.log("ok")
      const pdf = await response.buffer()
      resolve(pdf)
    } else {
      log.error("Failure in OCR " + response.statusText)
      reject(response.statusText)
    }
  })

}
