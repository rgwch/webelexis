/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
// jshint -W033
define(["./lab_handler", "datetools"], function (lh, dt) {
  var result

  function str(offset) {
    var dat = new Date()
    dat.setDate(dat.getDate() - offset)
    return dt.makeCompactFromDateObject(dat)
  }

  function checkCruncherItem(cruncher, name, itemids) {
    cruncher.hasOwnProperty("groups").should.be.true
    cruncher.groups.hasOwnProperty(name).should.be.true
    cruncher.groups[name].hasOwnProperty("items").should.be.true
    for (var i = 0; i < itemids.length; i++) {
      cruncher.groups[name].items.hasOwnProperty(itemids[i]).should.be.true
    }
  }

  beforeEach(function () {
    result = {
      "status": "ok",
      "fields": ["date", "itemid", "name", "value"],
      "results": [
        [str(60), "1", "Hämoglobin", "12.2", "", "Hb", "A Hämat", "1", "11-15", "10-14", "w"], // 0
        [str(60), "5", "Glucose", "7.2", "", "Glu", "B Stoffwechsel", "1", "3-6", "3.0-6", "m"], // 1
        [str(50), "2", "Hämoglobin", "12.3", "", "Hb", "E Hämat ext", "1", "11-15", "10-14", "w"], // 2
        [str(40), "3", "TSH", "1.4", "", "TSH", "H Hormone", "1", "0.5-4.1", "0.5-4.1", "w"], // 3
        [str(25), "4", "Krea", "80", "blah", "Krea", "N Nierenfunktion", "1", "60-100", "60-100", "w"], // 4
        [str(25), "1", "Hämoglobin", "11.9", "", "Hb", "A Hämat", "1", "11-15", "10-14", "w"], // 5
        [str(20), "5", "Glucose", "6.8", "", "Glu", "B Stoffwechsel", "1", "3-6", "3.0-6", "m"], // 6
        [str(14), "6", "HbA1c", "6.3", "", "HbA1c", "B Stoffwechsel", "2", "4.1-6.2", "4.1-6.2", "w"], // 7
        [str(5), "1", "Hämoglobin", "13.0", "", "Hb", "A Hämat", "1", "11-15", "10-14", "w"], // 8
        [str(5), "5", "Glucose", "5.7", "", "Glu", "B Stoffwechsel", "1", "3-6", "3.0-6", "m"], // 9
        [str(5), "6", "HbA1c", "6.1", "", "HbA1c", "B Stoffwechsel", "2", "4.1-6.2", "4.1-6.2", "w"] // 10

      ]
    }
  })


  describe('labhandler', function () {
    it('should return a valid cruncher', function () {
      var cruncher = lh.crunch(result)
      checkCruncherItem(cruncher, "A Hämat", ["1"])
      checkCruncherItem(cruncher, "B Stoffwechsel", ["5", "6"])
      checkCruncherItem(cruncher, "E Hämat ext", ["2"])
      checkCruncherItem(cruncher, "H Hormone", ["3"])
      checkCruncherItem(cruncher, "N Nierenfunktion", ["4"])
    })

    it("should produce results correctly", function () {
      var cruncher = lh.crunch(result)
      cruncher.groups["A Hämat"]["items"]["1"]["act"]["avg"].should.equal(12.45)

    })

    it('should create minmax objects correctly', function () {
      lh.isOutOfRange("5", {min: 2, max: 4}).should.be.true
      var mm = lh.getRange("2-4")
      mm.min.should.equal(2)
      mm.max.should.equal(4)
      mm = lh.getRange("2.023 -10.13 ")
      mm.min.should.equal(2.023)
      mm.max.should.equal(10.13)
      mm = lh.getRange(">5")
      mm.min.should.equal(5)
      expect(mm.max).to.be.undefined
      mm = lh.getRange("<7")
      mm.max.should.equal(7)
      expect(mm.min).to.be.undefined
    })

  })
})
