const ZIP_MARKER = 5 << 29
import { Zip } from 'zlibt2'
import { Crypter, Modes } from '@rgwch/simple-crypt'
import unzipper from 'unzipper'
import { logger } from '../logger'

/**
 * Create a zip file with one entry
 * @param name name of the entry
 * @param data contents of the file
 * @returns the zipped file
 */
export const create = (name: string, data: any) => {
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

/**
 * Extract a zipped file previously created with create
 * @param zipped
 * @param name
 * @returns
 */
export const extract = async (zipped: Buffer, name: string): Promise<Buffer> => {
  return await unzip(zipped, name)
}

/**
 * Self test
 * @param fakedata
 * @returns
 */
export const check = async (fakedata) => {
  const zipped = await create("test", fakedata)
  const unzipped = await extract(zipped, "test")
  return unzipped
}


const unzip = (raw: any, name: string): Promise<any> => {
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
        logger.error("ziptool: " + err)
      })
    })
  } else {
    return Promise.resolve("")
  }
}

export const encrypt = async (raw: Buffer, password: string, salt: string): Promise<Buffer> => {
  if (raw) {
    const c = new Crypter(password, salt)
    const ret = await c.encryptBuffer(Buffer.from(raw), Modes.Xored)
    return ret
  }
}

export const decrypt = async (encrypted: Buffer, password: string, salt: string): Promise<Buffer> => {
  const c = new Crypter(password, salt)
  const ret = await c.decryptBuffer(encrypted)
  return ret

}
