/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

export default function (options = {}) {
  // eslint-disable-line no-unused-vars
  let blackbox = options['blackbox'] || true
  let generics = options['generics'] || false

  return async (context) => {
    if (context.params.query) {
      if (!context.params.query.deleted) {
        context.params.query.deleted = '0'
      }
      if (blackbox && context.params.query.blackbox === undefined) {
        context.params.query.bb = '0'
      }
      if (generics && context.params.query.generic_type === undefined) {
        context.params.query.$or = [
          { generic_type: 'O' },
          { generic_type: 'G' },
          { generic_type: 'K' },
        ]
      }
    }
    return context
  }
}
