/**
 ** This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/
define({
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


    makeCompactString: function (date) {
        var ret = this.dateStrings(date)
        return ret.year + ret.month + ret.day
    },

    makeDate: function (datestring) {
        var year = datestring.substring(0, 4)
        var month = datestring.substring(4, 6) - 1
        var day = datestring.substring(6, 8)
        return new Date(year, month, day)
    },

    makeDateFromlocal: function (datestring) {
        var ar = datestring.split(".")
        return new Date(ar[2], ar[1] - 1, ar[0])
    },

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
        /*
            var makeDateRFC3339 = function (date) {
                var ret = dateStrings(date)
                return ret.year + "-" + ret.month + "-" + ret.day
            }
            */
    makeDateString: function (date) {
        var ret = dateStrings(date)
        return ret.day + "." + ret.month + "." + ret.year
    }


})