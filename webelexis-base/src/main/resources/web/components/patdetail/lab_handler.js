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
    },
    // jshint -W004
    makeTable: function(crunched) {
      var ret = []
      for (var key in crunched.thisMonth) {
        var item = crunched.thisMonth[key]
        var row = []
        row[0] = item[2]
        row[1] = item[3]
        row[2] = ""
        row[3] = ""
        ret.push(row)
      }
      for (key in crunched.thisYear) {
        var item = crunched.thisYear[key]
        var row = []
        row[0] = item[2]
        row[1] = ""
        row[2] = item[3]
        row[3] = ""
        ret.push(row)
      }
      for (key in crunched.older) {
        var row = []
        var item = crunched.older[key]
        row[0] = item[2]
        row[1] = ""
        row[2] = ""
        row[3] = item[3]
      }
      return ret
    }
  }
})
