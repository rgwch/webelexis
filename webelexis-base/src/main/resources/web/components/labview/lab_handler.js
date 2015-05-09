/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

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
    /* create a min/max object from a "min-max" or a ">min" or a "<max" string */
    getRange: function(refvalue) {
      var ret = {}
      if ((refvalue !== undefined) && (refvalue !== null) && (typeof refvalue == 'string')) {
        var range = refvalue.split("-")
        if (range.length == 2) {
          var min = range[0].trim()
          var max = range[1].trim()
          if (!isNaN(min)) {
            ret.min = parseFloat(min)
          }
          if (!isNaN(max)) {
            ret.max = parseFloat(max)
          }
        } else {
          var margin = refvalue.trim()
          if (margin.charAt(0) === '<') {
            ret.max = parseFloat(margin.substring(1))
          } else if (margin.charAt(0) === '>') {
            ret.min = parseFloat(margin.substring(1))
          }
        }
      }
      return ret;
    },

    isOutOfRange: function(value, minmax) {
      if (isNaN(value)) {
        return false
      }
      var val = parseFloat(value)

      if (minmax.min !== undefined && minmax.min > val) {
        return true
      }
      if (minmax.max !== undefined && minmax.max < val) {
        return true
      }
      return false;

    },
    /*
    convert an sql result with lab items and lab results into an object like:
    {
      fields: <name of all fields>,
      rows: [[result1],[result2],...],
      groups : {
        groupname1:{
          name: groupname1,
          items:{
            item-key1 : {
              key: item-key1,
              name: name,
              range: normrange,
              samples: [{date: Date(), result: result, remark: "remark"},{},...]
              old:{
                  min: <min value>,
                  max: <max value>,
                  avg: <avg value>,
                  count:<number of samples>
              },
              med: {
                min: <min value>,
                max: <max value>,
                avg: <avg value>,
                count:<number of samples>
              },
              act: {
                min: <min value>,
                max: <max value>,
                avg: <avg value>,
                count:<number of samples>
              }
            },
            item-key2 : {
              ...
            },
            ...
          } // items
        },
        groupname2 : {
        ...
        }.
      ...
      } // groups
    }
    */

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
        // insert female norm range, if patient is female
        if (row[10].match(/[fFwW]/) !== null) {
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

  }
})
