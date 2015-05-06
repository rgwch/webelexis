/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['chart', "app/datetools"], function(ch, dt) {

  var fillColors = ["#e8f5d7", "#95e3f3", "#dcadee"]
  var strokeColors = ["black", "blue", "green"]
  var pointColors = ['black', '#ff0000', 'black']
  var pointStrokeColors = ['black', 'black', 'black']
  var pointHighlightFills = ['red', 'red', 'red']
  var pointHighlightStrokes = ['blue', 'red', 'blue']

  return {
    clear: function() {
      Chart.destroy()
    },
    create: function(values, ctx) {
      //var ctx = window.document.getElementById(canvas).getContext("2d")
      var lbl_raw = []
      var datasets = []
      var num = 0
      for (var key in values) {
        var item = values[key]
        var dataset = {
          label: item.name,
          fillColor: fillColors[num],
          strokeColor: strokeColors[num],
          pointColor: pointColors[num],
          pointStrokeColor: pointStrokeColors[num],
          pointHighlightFill: pointHighlightFills[num],
          pointHighlightStroke: pointHighlightStrokes[num],
          data: []
        }
        for (var i = 0; i < item.samples.length; i++) {
          var lbl = dt.makeCompactString(item.samples[i].date)
          if (lbl_raw.indexOf(lbl) == -1) {
            lbl_raw.push(lbl)
          }
          dataset.data.push(item.samples[i].result)
        }
        datasets.push(dataset)
        num++
      }
      var labels = []
        // jshint -W004
      lbl_raw = lbl_raw.sort()
      for (var i = 0; i < lbl_raw.length; i++) {
        labels.push(dt.makeDateFromElexisDate(lbl_raw[i]))
      }
      var data = {
        labels: labels,
        datasets: datasets
      }
      if (data.datasets.length > 0) {
        var lineChart = new ch(ctx).Line(data, {
            responsive: true,
            datasetFill: datasets.length == 1
          })
          //$(canvas).parent().append(lineChart.generateLegend() );
        return lineChart
      }
      return {}
    }
  }

})
