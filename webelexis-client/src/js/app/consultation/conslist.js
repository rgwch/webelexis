define(['knockout', 'bus', 'config', 'underscore', 'datetools', 'samdas'], function (ko, bus, cfg, _, dt, smd) {


  function KonsList() {
    var self = this;
    self.patid;
    self.entries = ko.observableArray([]);

    self.loadConses = function () {
      bus.send("ch.webelexis.patient.cons", {
        action: "list",
        patid: self.patid,
        sessionID: cfg.sessionID
      }, function (result) {
        if (result === undefined) {
          window.alert(self.R.noanswer)
        } else if (result.status === "ok") {
          self.entries(_.map(result.results, function (cons) {
              return ({id: cons.id, date: dt.makeLocalFromCompact(cons.date), text: smd.plaintext(cons.entry)})
            })
          )
        } else {
          window.alert("error " + result.message)
        }
      })
    };
    self.busListener = function (msg) {
      if (msg === "open") {
        self.loadConses()
      }
    };

    self.activate = function (patid) {
      self.patid = patid;
      bus.addListener(self.busListener, true)
    };

    self.deactivate = function () {
      bus.removeListener(self.busListener)

    }
  }

  return KonsList
})
;
