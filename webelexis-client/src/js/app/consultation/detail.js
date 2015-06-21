/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'editor', 'config', 'bus', 'samdas', 'durandal/app', 'i18n'], function (ko, ed, cfg, bus, smd, appl, R) {

  function ConsDetailModel() {
    var self = this;

    self.contents = ko.observable(R.t("global.loading"));
    var metaInfos=ko.observableArray([
      {
        title: "Diagnosen"
      },
      {
        title: "Labor"
      },
      {
        title: "Verrechnung"
      }
      ])
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
          appl.showMessage(R.t("global.timeout"), R.t("global.connection_error"))
        } else if (result.status === "ok") {
          var cons = result.result;
          if (cons) {
            self.contents(smd.html(cons.entry))
          } else {
            appl.showMessage(R.t("global.nodadat"), R.t("global.error"))
          }
        } else {
          appl.showMessage(result.status+" "+result.message, R.t("global.error"))
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
