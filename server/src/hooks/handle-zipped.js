const unzipper = require('unzipper')
const stream = require('stream')

const unzip = raw => {
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
}
module.exports = (source, dest) => {
  return async ctx => {
    if (ctx.result && ctx.result[source]) {
      ctx.result[dest] = await unzip(ctx.result.source)
    } else if (ctx.result.data) {
      for (const el of ctx.result.data) {
        let ps= await unzip(el[source])
        el[dest]=ps
      }
    }
    return ctx
  }
}
