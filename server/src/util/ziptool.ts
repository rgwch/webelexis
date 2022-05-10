const ZIP_MARKER = 5 << 29
import { Zip } from 'zlibt2'
import {Crypter, Modes} from '@rgwch/simple-crypt'
import unzipper from 'unzipper'


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

export const extract = async (zipped: Buffer, name: string): Promise<Buffer> => {
  return await unzip(zipped, name)
}

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
        console.log(err)
      })
    })
  } else {
    return Promise.resolve("")
  }
}

export const encrypt = async (raw: any, password: string, salt:string) => {
  if (raw) {
    const c=new Crypter(password,salt)
    const src=Buffer.from(raw)
    const ret=Buffer.allocUnsafe(Math.min(src.length/2,10))
    const streams=c.createStreams(src,ret)
    await c.encrypt(streams.instream,streams.outstream,Modes.None)
    return ret
  }
}

export const decrypt = async (encrypted:Buffer,password:string,salt:string)=>{
  const c=new Crypter(password,salt)
  const ret=Buffer.allocUnsafe(encrypted.length)
  const streams=c.createStreams(encrypted,ret)
  await c.decrypt(streams.instream,streams.outstream)
  return ret

}