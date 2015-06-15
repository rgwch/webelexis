/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * Created by gerry on 09.06.15.
 */

define(['knockout', 'bus', 'config', 'durandal/system', 'i18n', 'datetools', 'underscore'], function (ko, eb, cfg, system, R, dt, _) {

  function FindPat() {
    var self = this;

    self.people = ko.observableArray()

    self.displayClass = function (g) {
      if (g === undefined || g === null) {
        return "list-group-item-disabled"
      }
      if (g.toLowerCase() === 'm') {
        return "list-group-item-info";
      } else if (g.toLowerCase() === 'f' || g.toLowerCase() === 'w') {
        return "list-group-item-danger"
      } else {
        return "list-group-item-warning"
      }

    }

    self.sendQuery = function () {
      eb.send("ch.webelexis.patient.find", {
        "expr": $("#queryString").val(),
        "sessionID": cfg.sessionID
      }, function (result) {
        if (result === undefined) {
          system.log("connection error")
        } else {
          if (result.status === "ok") {
            self.people(_.map(result.result, function (pat) {
              return {
                text: pat.Bezeichnung1 + " " + pat.Bezeichnung2 + ", " + dt.makeDateFromElexisDate(pat.Geburtsdatum),
                css: self.displayClass(pat.geschlecht),
                href: "#patdetail/" + pat.id
              }
            }))
          } else {
            system.log("bad result")
          }
        }
      })
    }
  }


  return FindPat
})
;
