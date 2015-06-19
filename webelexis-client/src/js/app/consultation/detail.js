/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'editor', 'config', 'bus', 'samdas'], function (ko, ed, cfg, bus, smd) {

  function ConsDetailModel() {
    var self = this;

    self.contents = ko.observable("loading..");
    var edit = ed("edit");
    self.getText = function () {
      var htmltext = edit.getText();
      console.log(htmltext);
      var samdastext = smd.samdas(htmltext);
      console.log(samdastext);
      window.history.back()
    };

    self.cancel = function () {
      window.history.back()
    };
    self.loadCons = function () {
      bus.send("ch.webelexis.patient.cons", {
        action: "get",
        consid: self.consid,
        sessionID: cfg.sessionID
      }, function (result) {
        if (result.status === undefined) {
          window.alert("no response from server")
        } else if (result.status === "ok") {
          var cons = result.result;
          if (cons) {
            self.contents(smd.html(cons.entry))
          } else {
            window.alert("empty result")
          }
        } else {
          window.alert("error " + result.message)
        }
      })

    };
    self.busListener = function (msg) {
      if (msg === "open") {
        self.loadCons()
      }
    };
    self.activate = function (konsid) {
      self.consid = konsid;
      bus.addListener(self.busListener, true)
    };
    self.deactivate = function () {
      bus.removeListener(self.busListener)
    }
  }


  return ConsDetailModel

});
