/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
// jshint -W033
define(["components/patdetail/lab_handler", "app/datetools"], function(lh, dt) {
  var result

  function str(offset) {
    var dat = new Date()
    dat.setDate(dat.getDate() - offset)
    return dt.makeCompactString(dat)
  }

  beforeEach(function() {
    result = {
      "status": "ok",
      "fields": ["date", "itemid", "name", "value"],
      "results": [
        [str(60), "1", "Hämoglobin", "12.2"], // 0
        [str(60), "5", "Glucose", "7.2"], // 1
        [str(50), "2", "Hämoglobin", "12.3"], // 2
        [str(40), "3", "TSH", "1.4"], // 3
        [str(25), "4", "Krea", "80"], // 4
        [str(25), 1, "Hämoglobin", "11.9"], // 5
        [str(20), "5", "Glucose", "6.8"], // 6
        [str(14), "6", "HbA1c", "6.3"], // 7
        [str(5), "1", "Hämoglobin", "13,0"], // 8
        [str(5), "5", "Glucose", "5.7"], // 9
        [str(5), "6", "HbA1c", "6.1"] // 10

      ]
    }
  })

  it('should return a valid cruncher', function() {
    var cruncher = lh.crunch(result)
    cruncher.thisMonth["1Hämoglobin"].should.equal(result.results[8])
    cruncher.thisYear["2Hämoglobin"].should.equal(result.results[2])
    cruncher.thisMonth["4Krea"].should.equal(result.results[4])
    cruncher.thisYear["3TSH"].should.equal(result.results[3])
    cruncher.thisMonth["5Glucose"].should.equal(result.results[9])
    cruncher.thisYear["5Glucose"].should.equal(result.results[1])
    cruncher.thisMonth["6HbA1c"].should.equal(result.results[10])
  })


})
