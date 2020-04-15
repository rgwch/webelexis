const Zipper = require('node-zip')
const ZIP_MARKER = 1 << 29

exports.create = (name, data) => {
  const zip = new Zipper()
  zip.file(name, data)
  const zipped = zip.generate({ base64: false, compression: 'DEFLATE' })
  const ret=Buffer.from(zipped)
  const def = Buffer.allocUnsafe(ret.length + 4)
  const l = (ret.length & 0x1fffffff) | ZIP_MARKER
  def.writeInt32BE(l, 0)
  ret.copy(def, 4, 0)
  return def
}

exports.extract = (zipped, name) => {
  const raw=Buffer.from(zipped)
  const payload=Buffer.allocUnsafe(raw.length-4)
  raw.copy(payload,0,4)
  const unzip = new Zipper(payload.toString("utf8"), { base64: false, CheckCRC32: true })
  return unzip.files[name] ? unzip.files[name].asText() : ""
}

exports.check = (fakedata)=>{
  const zip=new Zipper()
  zip.file("test",fakedata)
  const data=zip.generate({base64:false, compression: 'DEFLATE'})
  const unzip = new Zipper(data, { base64: false, CheckCRC32: false })
  const dest= unzip.files["test"].asText()
  return dest
}

const unzipper = require('unzipper')

const unzip = raw => {
  if (raw) {
    const src = Buffer.from(raw)
    const buffer = Buffer.allocUnsafe(src.length - 4)
    src.copy(buffer, 0, 4)
    return unzipper.Open.buffer(buffer).then(d => {
      const rs = d.files[0].stream()
      return new Promise((resolve, reject) => {
        let ret = ""
        rs.on('data', chunk => {
          ret += chunk
        })
        rs.on('end', () => resolve(ret))
        rs.on('error', () => reject)
      })
    })
  } else {
    return Promise.resolve("")
  }
}
