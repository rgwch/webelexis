

module.exports = function (options = {}) {
  return ctx => {
    if (ctx.params.provider) {
      ctx.data = ctx.data || {}
      ctx.data.deleted = "1"
      return ctx.service.patch(ctx.id, ctx.data, ctx.params).then(deleted => {
        ctx.result = deleted
        return ctx
      })
    } else {
      return ctx
    }
  }
}
