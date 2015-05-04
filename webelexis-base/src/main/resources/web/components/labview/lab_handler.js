/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

/* Functions to convert an SQL response to something more handy */
define(['app/datetools'], function(dt) {

  function insert(arr, item, idx) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i][0] === (item[2])) {
        arr[i][idx] = item[3]
        return
      }
    }
    var row = []
    row[0] = item[2]
    row[1] = ""
    row[2] = ""
    row[3] = ""
    row[idx] = item[3]
    arr.push(row)
  }

  function checkSample(range, item) {
    if (isNaN(item.result)) {
      return range
    } else {
      var value = parseFloat(item.result)
      var sum = range.avg * range.count
      sum += value
      range.avg = sum / ++range.count
      if (value < range.min || range.min === 0) {
        range.min = value
      }
      if (value > range.max) {
        range.max = value
      }
      return range
    }
  }

  return {

    crunch: function(sqlResult) {
      var self = this
      if ((sqlResult === undefined) || (sqlResult.status !== 'ok')) {
        return null
      }
      var now = new Date().getTime()
      var lastMonth = new Date(now - 31 * 24 * 60 * 60000)
      var lastYear = new Date(now - 365 * 24 * 60 * 60000)

      var cruncher = {}
      cruncher.fields = sqlResult.fields
      cruncher.rows = sqlResult.results
      cruncher.groups = {}

      /* insert all SQL result rows grouped by Item ID into the cruncher */
      for (var i = 0; i < cruncher.rows.length; i++) {
        var row = cruncher.rows[i]
        var key = row[1] // itemId
          // get or create the item
        var item = {
          name: row[2],
          range: row[8],
          key: key,
          samples: [],
          old: {
            min: 0,
            max: 0,
            avg: 0,
            count: 0
          },
          med: {
            min: 0,
            max: 0,
            avg: 0,
            count: 0
          },
          act: {
            min: 0,
            max: 0,
            avg: 0,
            count: 0
          }
        }
        if (row[10].match(/[fFwW]/) != null) {
          item.range = row[9]
        }
        var group = {
          name: row[6],
          items: {}
        }
        if (cruncher.groups.hasOwnProperty(row[6])) {
          group = cruncher.groups[row[6]]
        }
        if (group.items.hasOwnProperty(key)) {
          item = group.items[key]
        }
        var labDate = dt.makeDate(row[0])
        var sample = {
          date: labDate,
          result: row[3],
          remark: row[4]
        }
        item.samples.push(sample)
        if (labDate > lastMonth) {
          item.act = checkSample(item.act, sample)
        } else if (labDate > lastYear) {
          item.med = checkSample(item.med, sample)
        } else {
          item.old = checkSample(item.old, sample)
        }
        group.items[key] = item
        cruncher.groups[row[6]] = group
      }
      return cruncher
    },
    //jshint -W004

    makeTable: function(crunched) {
      var ret = []
      for (var key in crunched.thisMonth) {
        var item = crunched.thisMonth[key]
        insert(ret, item, 1)
      }
      for (key in crunched.thisYear) {
        var item = crunched.thisYear[key]
        insert(ret, item, 2)
      }
      for (key in crunched.older) {
        var item = crunched.older[key]
        insert(ret, item, 3)
      }
      return ret
    }

  }
})
