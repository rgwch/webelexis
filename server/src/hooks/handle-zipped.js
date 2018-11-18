const unzipper = require('unzipper')
const stream = require('stream')

const unzip = async raw => {
  try {
    const src=Buffer.from(raw)
    const buffer=Buffer.allocUnsafe(src.length-4)
    src.copy(buffer,0,4)
    const d = await unzipper.Open.buffer(buffer)
    const rs=d.files[0].stream()
    rs.on('readable',()=>{
      let chunk
      while( null !== (chunk=rs.read())){
        console.log(chunk)
      }
    })
    const ret=rs.read()
  } catch (err) {
    console.log(err)
    return ""
  }
}
module.exports = (source, dest) => {
  return async ctx => {
    if (ctx.result && ctx.result[source]) {
      ctx.result[dest] = await unzip(ctx.result.source)
    } else if (ctx.result.data) {
      for (const el of ctx.result.data) {
        el[dest] = await unzip(el[source])
      }
    }
  }
}
