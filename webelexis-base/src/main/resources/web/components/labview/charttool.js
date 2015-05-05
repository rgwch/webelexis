/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['chart'], function(ch) {

  var fillColors = ["grey", "white", "white"]
  var strokeColors = ["red", "blue", "green"]
  var pointColors = ['black', 'black', 'black']
  var pointStrokeColors = ['black', 'black', 'black']
  var pointHighlightFills = ['red', 'red', 'red']
  var pointHighlightStrokes = ['blue', 'red', 'blue']

  return {
    create: function(values, canvas) {
      var ctx = window.document.getElementById(canvas).getContext("2d")
      var labels = []
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
          labels.push(item.samples[i].date.getMonth())
          dataset.data.push(item.samples[i].result)
        }
        datasets.push(dataset)
        num++
      }
      var data = {
          labels: labels,
          datasets: datasets
        }
        //var options = {}
      var lineChart = new ch(ctx).Line(data)
      lineChart.update()
      return lineChart
    }
  }

})
