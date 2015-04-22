/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['app/datetools'], function(dt) {

  return {
    /* rows in sqlResult are sorted by date. We just crunch all rows into a hashmap, so
      at the end, the latest values are set */

    crunch: function(sqlResult) {
      var self = this
      if (sqlResult.status !== 'ok') {
        return null
      }
      var now = new Date().getTime()
      var lastMonth = new Date(now - 31 * 24 * 60 * 60000)
      var lastYear = new Date(now - 365 * 24 * 60 * 60000)

      var cruncher = {}
      cruncher.fields = sqlResult.fields
      cruncher.rows = sqlResult.results
      cruncher.thisMonth = {}
      cruncher.thisYear = {}
      cruncher.older = {}

      for (var i = 0; i < cruncher.rows.length; i++) {
        var row = cruncher.rows[i]
        var key = row[1] + row[2] // itemId + title
        var labDate = dt.makeDate(row[0])
        if (labDate > lastMonth) {
          cruncher.thisMonth[key] = row
        } else if (labDate > lastYear) {
          cruncher.thisYear[key] = row
        } else {
          cruncher.older[key] = row
        }
      }
      return cruncher
    }
  }
})
