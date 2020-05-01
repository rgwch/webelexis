const fetch = require('node-fetch')

module.exports = cnt => {
  return new Promise(async (resolve, reject) => {
    const response = await fetch('http://localhost:9997', {
      method: 'post', 
      headers: {
        "content-type": "application/octet-stream",
        "accept": "application/octet-stream"
      }, body: cnt
    })
    if (response.status == 200) {
      console.log("ok")
      const pdf = await response.buffer()
      resolve(pdf)
    } else {
      reject(response.statusText)
    }
  })

}
