const ZIP_MARKER = 5 << 29
import { Zip } from 'zlibt2'
import  unzipper from 'unzipper'


export const create = (name, data) => {
  const zipped = new Zip()
  zipped.addFile(Buffer.from(data), { filename: name })
  const compressed = zipped.compress()
  const ret = Buffer.from(compressed)
  const def = Buffer.allocUnsafe(ret.length + 4)
  const l = (ret.length & 0x1fffffff) | ZIP_MARKER
  def.writeInt32BE(l, 0)
  ret.copy(def, 4, 0)
  return def
}

export const extract = async (zipped, name) => {
  return await unzip(zipped, name)
}

export const check = async (fakedata) => {
  const zipped = exports.create("test", fakedata)
  const unzipped = await exports.extract(zipped, "test")
  return unzipped
}


const unzip = (raw, name) => {
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
      }).catch(err => {
        console.log(err)
      })
    })
  } else {
    return Promise.resolve("")
  }
}

