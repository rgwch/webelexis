/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
// jshint -W033
define(['jquery', 'components/labview/charttool'], function($, ch) {

  describe("given a canvas and the Chart.js library", function() {
    it('should create and draw a chart', function() {
      $('body').append('<canvas id="chartCanvas" width="600", height="400"></canvas>')
      var items = {
        "1234": {
          name: "anItem",
          samples: [{
            date: new Date(),
            result: 22
          }, {
            date: new Date(new Date().getTime() - 86400000),
            result: 17
          }]
        }
      }
      var ctx = $("#chartCanvas").get(0).getContext("2d")
      var testChart = ch.create(items, ctx)
      expect(testChart).to.not.be.undefined
        //console.log(testChart)
    })

  })
})
