/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Don't really remove objects if a client asks to do so. Instead, set 'deleted' to "1".
 * Only if the request originates from the server by itself, then really remove.
 * This hook is insered as an app hook before removal, i.e works on all datatypes.
 */
module.exports = ctx => {
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
