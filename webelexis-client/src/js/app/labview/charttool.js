/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['flot', 'underscore', 'flot-time', 'smooth'], function (ch, _) {

  var fillColors = ["#e8f5d7", "#95e3f3", "#dcadee"];
  var strokeColors = ["black", "blue", "green"];
  var pointColors = ['black', '#ff0000', 'black'];
  var pointStrokeColors = ['black', 'black', 'black'];
  var pointHighlightFills = ['red', 'red', 'red'];
  var pointHighlightStrokes = ['blue', 'red', 'blue'];

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

    create: function (labItems, ctx) {
      var cutoff = _.now() - 86400000 * 6 * 365;

      var datasets = [];
      _.each(labItems, function (item) {
        var samples = _.reject(item.samples, function (expl) {
          if (expl.date.getTime() < cutoff) {
            return true;
          }
          if (isNaN(expl.result)) {
            return true
          }
          if (expl.result === 0) {
            return true
          }
          return false
        });
        samples = _.sortBy(samples, function (sample) {
          return sample.date.getTime()
        });
        var dataset = {
          label: item.name,
          points: {
            show: false
          },
          lines: {
            show: true
          },
          curvedLines: {
            apply: true
          },
          data: samples.map(function (sample) {
            return [sample.date.getTime(), sample.result]
          })
        };
        datasets.push(dataset);
        var points = {
          points: {
            show: true
          },
          data: dataset.data
        };
        datasets.push(points)
      });
      return ctx.plot(datasets, {
        series: {
          curvedLines: {
            active: true,
            monotonicFit: true
          }
        },
        xaxis: {
          mode: "time",
          timeformat: "%d.%m.%y",
          position: "bottom"
        },
        legend: {
          show: true,
          position: "nw"
        }
      })

    }
  }

});
