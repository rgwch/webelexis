/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'datetools', 'bus', 'config', './lab_handler', './charttool', 'underscore', 'i18n', 'spark'],
  function (ko, dt, bus, cfg, lh, chart, _, R) {
    var dummy = '7ba4632caba62c5b3a366';


    function LabViewModel() {
      var self = this;
      self.msg = function (msgid) {
        return R.t("lab." + msgid)
      };
      self.crunched = {};
      self.loaded = ko.observable(false);
      self.display = ko.observable("table");
      self.groups = ko.observableArray();
      self.activeGroup = ko.observable(-1);
      self.patid = "";
      self.checkedItems = ko.observable({});
      self.context2d = {};
      self.lineChart = {};
      self.detailDates = ko.observableArray();

      /* If the user clicks on a greoup heading, we display the labvalues inside that group and
       create a sparkline-chart on the fly */
      self.openGroup = function (index) {
        if (self.activeGroup() == index()) {
          self.activeGroup(-1)
        } else {
          self.activeGroup(index());
          var list = self.groups()[index()];
          _.each(list.items, function (labitem) {
            var vals = _.map(labitem.samples, function (sample) {
              var value = sample.result;
              if (value.charAt(0) === '<' || value.charAt(0) === '>') {
                value = value.substring(1)
              }
              return value
            });
            var minmax = lh.getRange(labitem.range);
            $("#" + labitem.key).sparkline(vals, {
              spotColor: false,
              normalRangeMin: minmax.min,
              normalRangeMax: minmax.max
            })
          })
        }
      };

      /* is a labItem checked? */
      self.isChecked = function (item) {
        return self.checkedItems().hasOwnProperty(item.key)
      };

      self.checkAll = function () {
        var o = self.checkedItems();
        if (_.isEmpty(o)) {
          var list = self.groups()[self.activeGroup()];
          _.each(list.items, function (item) {
            o[item.key] = item
          });
          self.checkedItems(o)
        } else {
          self.checkedItems({})
        }
      };

      /* toggle checked/unchecked state of labItem */
      self.toggleItem = function (item) {
        var o = self.checkedItems();
        var key = item.key;
        if (o.hasOwnProperty(key)) {
          delete o[key]
        } else {
          o[key] = item
        }
        self.checkedItems(o)
      };

      /* create a chart of checked labItem(s). If an item is given as parameter, show only this item and uncheck others */
      self.createChart = function (item) {
        if (_.isObject(item)) {
          var ci = {};
          var key = item.key;
          ci[key] = item;
          self.checkedItems(ci)
        }
        if (_.isEmpty(self.checkedItems())) {
          window.alert("Sie müssen mindestens einen parameter auswählen")
        } else {
          self.display('chart');
          self.lineChart = chart.create(self.checkedItems(), $('#chartCanvas'));
          //self.context2d = $("#chartCanvas").get(0).getContext("2d")
          //self.lineChart = chart.create(self.checkedItems(), self.context2d)
        }
      };
      self.closeChart = function () {
        self.display('table')
      };
      /* push all items of a group into an array */
      self.itemsInGroup = function (group) {
        var ret = _.values(group.items).sort(function (a, b) {
          return (parseInt(a.prio) - parseInt(b.prio))
        });
        return ret
      };

      self.groupname = function (group) {
        return group.name.slice(group.name.indexOf(" "));
      };

      /* Message to display in group header. If one of the results of the last month is outOfRange, or if the latest measured
       result is outOfRange -> mark Item as "to check"
       */
      self.noteworthy = function (group) {
        var ret = "";
        _.each(group.items, function (item) {
          var check = item.act;
          var addit = false;
          var range = lh.getRange(item.range);
          if (check.count && parseInt(check.count) !== 0) {
            if (lh.isOutOfRange(check.min, range) || lh.isOutOfRange(check.max, range)) {
              addit = true
            }
          }
          if (addit === false) {
            var latest = _.max(item.samples, function (a) {
              return a.date.getTime()
            });
            if (lh.isOutOfRange(latest.result, range)) {
              addit = true
            }
          }
          if (addit) {
            ret += " " + item.name
          }
        });
        return ret
      };

      /**
       Create the detail-table: First, find all unique sample dates within the lab items of the currently
       opened lab group, then for each item, create a table cell for every sample, or add an empty cell, if no
       sample exists at the given date
       */
      self.showdetails = function () {
        var table = [];
        var items = self.groups()[self.activeGroup()].items;
        _.each(items, function (item) {
          table.push(_(item.samples).pluck("date"))
        });
        var tb = _.sortBy(_.flatten(table), function (date) {
          return date.getTime()
        });
        var uniqueDates = _.uniq(_.map(tb, function (date) {
          return dt.makeLocalFromDateObject(date)
        }));
        $("#detailtable").empty();

        _.each(items, function (item) {
          var row = $("<tr>");
          row.append('<td class="labitem"><b>' + item.name + "</b></td>");
          _.each(uniqueDates, function (date) {
            var result = self.getValueForDate(item, date);
            if (lh.isOutOfRange(result, lh.getRange(item.range))) {
              row.append('<td class="labitem"><span class="red">' + result + "</span></td>")
            } else {
              row.append('<td class="labitem">' + result + "</td>")
            }
          });
          $("#detailtable").append(row)
        });
        self.detailDates(uniqueDates);
        self.display("detail");
        $("#detailheader").prepend("<th></th>")
      };

      self.getValueForDate = function (item, date) {

        var sample = _.find(item.samples, function (s) {
          return (dt.makeLocalFromDateObject(s.date) === date)
        });
        if (sample === undefined) {
          return ""
        } else {
          return sample.result
        }

      };

      self.outOfRange = function (refvalue, value) {
        var minmax = lh.getRange(refvalue);
        return lh.isOutOfRange(value, minmax)
      };

      self.displayText = function (value) {
        if (isNaN(value)) {
          return ""
        } else if (parseFloat(value) === 0) {
          return ""
        } else {
          return value.toFixed(2)
        }
      };

      // fetch lab summary
      self.loadLabSummary = function () {
        bus.send("ch.webelexis.patient.labresult", {
          "mode": "latest",
          "patid": self.patid,
          "sessionID": cfg.sessionID
        }, function (result) {
          if (result === undefined) {
            window.alert(self.R.noanswer)

          } else if (result.status !== "ok") {
            window.alert("Fehler bei der Abfrage: " + result.status + " " + result.message)
          } else {
            self.crunched = lh.crunch(result);
            var sorted = _.sortBy(_(self.crunched.groups).values(), function (group) {
              return (group.name)
            });
            self.groups(sorted);
            self.loaded(true)

          }
        })
      };
      self.busListener = function (msg) {
        if (msg === "open") {
          self.loadLabSummary()
        }
      };

      self.activate = function (pat) {
        self.patid = pat;
        bus.addListener(self.busListener, true)
      };

      self.deactivate = function () {
        bus.removeListener(self.busListener)

      }
    }

    return LabViewModel
  });
