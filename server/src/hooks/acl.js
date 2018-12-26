const {needsRight} = require('../util/acl')

module.exports = ctx => {
  if (ctx.type == "before" && ctx.params && ctx.params.provider) {
    const servicename = ctx.path
    const method = ctx.method
    const user=ctx.params.user
    const neededACE=servicename+"."+method
    needsRight(user,neededACE)
  }
}
