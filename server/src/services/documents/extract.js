const intoStream = require('into-stream')
const fetch = require('node-fetch')
const log = require('../../logger')
const ocrservice = require('../../util/ocr')

module.exports = app => {
  const joblist = []
  let waiting = false
  tika = async cnt => {
    const addr = app.get('solr').tika
    if (!addr) {
      log.error("solr.tika not defined in app configuration")
      throw new Error("Tika not found")
    }

    const rmeta = await fetch(addr + "/meta", { headers: { accept: "application/json" }, method: "put", body: intoStream(cnt) })
    if (rmeta.status != 200) {
      throw new Error(rmeta.statusText)
    }
    const rtext = await fetch(addr + "/tika", { headers: { accept: "text/plain" }, method: "put", body: intoStream(cnt) })
    if (rtext.status != 200) {
      throw new Error(rtext.statusText)
    }
    const text = (await rtext.text()).trim()
    const meta = await rmeta.json()
    log.debug("text: " + text.length)

    return { meta, text }
  }
  ocr = async (file) => {
    joblist.push(file)
  }

  exec = () => {
    if (joblist.length && !waiting) {
      const job = joblist.pop()
      waiting = true
      ocrservice(job.cntents).then(ocrd => {
        if (ocrd.length != job.contents.length) {
          const service = app.service('documents')
          service.update(job.meta.id, job.meta, { contents: ocrd }).then(updated => {
            waiting = false
          })
        } else {
          waiting = false
        }
      })
    }
  }
  setInterval(exec, 1000)

  return { tika, ocr }
}
