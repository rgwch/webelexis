/**
 ** This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/
define({

  // Helper function to take day, month and year from a Date object
  dateStrings: function (date) {
    var month = (date.getMonth() + 1).toString();
    if (month.length < 2) {
      month = '0' + month
    }
    var day = date.getDate().toString();
    if (day.length < 2) {
      day = '0' + day
    }
    return {
      "year": date.getFullYear().toString(),
      "month": month,
      "day": day
    }
  },

  // create a YYYYMMDD String from a Date object
  makeCompactFromDateObject: function (date) {
    var ret = this.dateStrings(date)
    return ret.year + ret.month + ret.day
  },

  // Create a Date object from a YYYYMMDD String
  makeDateObjectFromCompact: function (datestring) {
    if (datestring !== undefined && datestring.length === 8) {
      var year = datestring.substring(0, 4)
      var month = datestring.substring(4, 6) - 1
      var day = datestring.substring(6, 8)
      return new Date(year, month, day)
    } else {
      return ""
    }
  },

  // Create a Date object from a dd.mm.yyyy String
  makeDateObjectFromLocal: function (datestring) {
    if (datestring !== undefined) {
      var ar = datestring.split(".")
      var yr = parseInt(ar[2])
      if (yr < 30) {
        yr += 2000
      } else if (yr < 100) {
        yr += 1900
      }
      return new Date(yr, parseInt(ar[1]) - 1, ar[0])
    } else {
      return new Date()
    }
  },

  // make a hh:mm String from a number of minutes
  makeTime: function (minutes) {
    var hours = parseInt(minutes / 60)
    var mins = (minutes - (hours * 60)).toString()
    hours = hours.toString()
    if (hours.length < 2) {
      hours = "0" + hours
    }
    if (mins.length < 2) {
      mins = "0" + mins
    }

    return hours + ":" + mins
  },

  // make a number of minutes from a hh:mm String
  makeMinutes: function (timeString) {
    var hm = timeString.split(":")
    var ret = parseInt(hm[0]) * 60 + parseInt(hm[1])
    return ret;
  },

  // make a YYYY-MM-DD String from a Date object
  makeDateRFC3339: function (date) {
    var ret = this.dateStrings(date)
    return ret.year + "-" + ret.month + "-" + ret.day
  },

  // make a dd.mm.yyyy String from a Date object
  makeLocalFromDateObject: function (date) {
    var ret = this.dateStrings(date)
    return ret.day + "." + ret.month + "." + ret.year
  },

  // make a dd.mm.yyyy from yyyymmdd
  makeLocalFromCompact: function (ed) {
    if (ed === undefined || ed === null || ed.length != 8) {
      return ""
    } else {
      return ed.substring(6, 8) + "." + ed.substring(4, 6) + "." + ed.substring(0, 4)
    }

  }
})
