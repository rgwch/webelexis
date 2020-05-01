const intoStream = require('into-stream')
const fetch = require('node-fetch')

module.exports = app => {
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

    return { meta, text }
  }
  return tika
}
