/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
 // jshint -W033
define(["components/patdetail/lab_handler"],function(lh){
  var result

  beforeEach(function(){
    result={
      "status":"ok",
      "fields":["date","itemid","name","value"],
      "results":[
        ["20100414","1","Hämoglobin","12.2"],
        ["20100828","2","Hämoglobin","12.3"],
        ["20110220","3","TSH","1.4"],
        ["20120418","4","Krea","80"],
        ["20120418",1,"Hämoglobin","11.9"],
        ["20130618","5","Glucose","7.2"],
        ["20130628","5","Glucose","6.8"],
        ["20130628","6","HbA1c","6.3"],
        ["20140112","1","Hämoglobin","13,0"],
        ["20140112","5","Glucose","5.7"],
        ["20140112","6","HbA1c","6.1"]
      ]
    }
  })

  it('should return a valid cruncher', function(){
    var cruncher=lh.loadLatest(result)
    cruncher._latest["1Hämoglobin"].should.equal(result.results[8])
    cruncher._latest["2Hämoglobin"].should.equal(result.results[1])
    cruncher._latest["4Krea"].should.equal(result.results[3])
    cruncher._latest["3TSH"].should.equal(result.results[2])
    cruncher._latest["5Glucose"].should.equal(result.results[9])
    cruncher._latest["6HbA1c"].should.equal(result.results[10])
  })

  
})
