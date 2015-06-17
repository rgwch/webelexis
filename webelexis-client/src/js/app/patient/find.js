/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 * Created by gerry on 09.06.15.
 */

define(['knockout', 'bus', 'config', 'durandal/system', 'i18n', 'datetools', 'underscore', 'plugins/router'],
  function (ko, eb, cfg, system, R, dt, _, router) {

    function FindPat() {
      var self = this;

      self.people = ko.observableArray();
      self.queryInput = ko.observable();

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

      };

      self.openClose = function (item) {
        item.opened(!item.opened())
      };
      self.sendQuery = function () {
        router.navigate("#findpat/" + self.queryInput(), {trigger: false, replace: true});
        eb.send("ch.webelexis.patient.find", {
          "expr": self.queryInput(),
          "sessionID": cfg.sessionID
        }, function (result) {
          if (result === undefined) {
            system.log("connection error")
          } else {
            if (result.status === "ok") {
              self.people(_.map(result.result, function (pat) {
                return {
                  text: pat.Bezeichnung1 + " " + pat.Bezeichnung2 + ", " + dt.makeLocalFromCompact(pat.Geburtsdatum),
                  css: self.displayClass(pat.geschlecht),
                  href: "#patdetail/" + pat.id,
                  entry: pat,
                  opened: ko.observable(false)
                }
              }))
            } else {
              system.log("bad result")
            }
          }
        })
      };
      self.activate = function (query) {
        if (query) {
          self.queryInput(query);
          self.sendQuery()
        }
      }
    }


    return FindPat
  })
;
