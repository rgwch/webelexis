/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['flot', "app/datetools", 'underscore','flot-time'], function(ch, dt, _) {

  var fillColors = ["#e8f5d7", "#95e3f3", "#dcadee"]
  var strokeColors = ["black", "blue", "green"]
  var pointColors = ['black', '#ff0000', 'black']
  var pointStrokeColors = ['black', 'black', 'black']
  var pointHighlightFills = ['red', 'red', 'red']
  var pointHighlightStrokes = ['blue', 'red', 'blue']

  return {
    /* LabItem:
    {
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
   }
   */

    create: function(labItems,ctx){
      var datasets=[]
      _.each(labItems, function(item){
        var dataset={}
        dataset.data=item.samples.map(function(sample){
          return [sample.date.getTime(),sample.result]
        })
        dataset.label=item.name
        dataset.points={show: true}
        dataset.lines={show:true}
        datasets.push(dataset)
      })
      ctx.plot(datasets,{
        xaxis: {
          mode: "time",
          timeformat: "%d.%m.%y",
          position: "bottom"
        }
      })
    },
    create_o: function(values, ctx) {
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
          var result=item.samples[i].result
          if(!_.isNumber(result)){
            result=result.trim()
            if(result.charAt(0)==='<' || result.charAt(0)==='>'){
              result=result.substring(1)
            }
          }
          if(isNaN(result)){
            result=0
          }
          dataset.data.push(parseFloat(result))
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
