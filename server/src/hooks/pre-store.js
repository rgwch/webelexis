const uuid = require('uuid/v4')

const do_prepare = obj => {
  if (obj.LASTUPDATE) {
    obj.LASTUPDATE = new Date().getTime()
    delete obj.lastupdate
  } else {
    obj.lastupdate = new Date().getTime()
  }
  if (!obj.id) {
    obj.id = uuid()
  }
  obj.deleted = "0"
  delete obj.type
  return obj
}


module.exports = ctx => {
  if (ctx.data) {
    if (Array.isArray(ctx.data)) {
      for (const item of ctx.data) {
        do_prepare(item)
      }
    } else {
      ctx.data = do_prepare(ctx.data)
    }
  }
}
