/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * If the query states no value for 'deleted', add a 'deleted='0' clause.
 * Except elexis-userconfig (table has no 'deleted' field)
 * @param {*} options
 */
export default function (options = {}) {
  return context => {
    if (context.path !== "elexis-userconfig") {
      if (context.params.query) {
        if (!context.params.query.deleted) {
          context.params.query.deleted = "0"
        }
      } else {
        context.params.query = { deleted: "0" }
      }
    }
    return context
  }
}
