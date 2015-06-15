/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * Created by gerry on 09.06.15.
 */

define(['knockout', 'bus', 'config', 'durandal/system'], function (ko, eb, cfg, system) {

  function FindPat() {
    var self = this;
    self.people = ko.observableArray()
    self.sendQuery = function () {
      eb.send("ch.webelexis.patient.find", {
        "expr": $("#queryString").val(),
        "sessionID": cfg.sessionID
      }, function (result) {
        if (result === undefined) {
          system.log("connection error")
        } else {
          if (result.status === "ok") {
            self.people(result.result);
          } else {
            system.log("bad result")
          }
        }
      })
    }
  }

  return FindPat
});
