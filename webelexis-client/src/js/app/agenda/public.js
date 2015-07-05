/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'bus', 'config', 'datetools', 'i18n', 'durandal/app', 'plugins/router', 'text!../../../txt/termin-howto.html', 'durandal/events'],
  function (ko, bus, cfg, dt, R, appl, router, how) {


    function AgendaViewModel() {
      var self = this;
      self.msg = function (id) {
        return R.t("m.agenda." + id)
      }
      /**
       * client side representation of an Elexis-appointment
       */

      self.Appointment = function (row) {
        var app = this;
        app.expanded = ko.observable(false)
        app.date = dt.makeDateObjectFromCompact(row[0])
        app.begin = dt.makeTime(parseInt(row[1]));
        app.end = dt.makeTime(parseInt(row[1]) + parseInt(row[2]));
        app.time = app.begin + "-" + app.end
        app.type = row[3]
        app.patid = row[4]
        app.displayClass = ko.pureComputed(function () {
          return app.type === 'available' ? "available" : "occupied"
        })
        app.displayText = ko.pureComputed(function () {
          var tr = app.begin + "-" + app.end + " "
          if (app.type === "available") {
            tr += "frei"
          } else if (app.type === 'user') {
            tr += R.t("m.agenda.yourapp")
          } else {
            tr += R.t("m.agenda.occupied")
          }
          return tr
        })

        app.loggedInText = ko.pureComputed(function () {
          /*
           var ret = "Sie sind angemeldet als " + cfg.user().username + ". Bitte bestätigen Sie den gewünschten Termin am " +
           dt.makeLocalFromDateObject(app.date) + " um " + app.begin + " Uhr."
           */
          var ret = R.t("m.agenda.loggedin", {
            user: cfg.user().username,
            day: dt.makeLocalFromDateObject(app.date),
            time: app.begin
          })
          return ret;
        })


      }
      self.actDate = ko.observable()
      self.howto = ko.observable()
      self.now = ko.observable(dt.makeLocalFromDateObject(new Date()))

      self.appointments = ko.observableArray([]);
      self.lastExpanded = null


      self.loadAppointments = function () {
        var act = dt.makeDateObjectFromLocal(self.actDate())
        router.navigate("#termine/" + dt.makeCompactFromDateObject(act), {trigger: false, replace: true})

        if (self.lastExpanded !== null) {
          self.lastExpanded.expanded(false);
          self.lastExpanded = null;
        }
        bus.send('ch.webelexis.publicagenda', {
          request: 'list',
          begin: dt.makeCompactFromDateObject(act),
          end: dt.makeCompactFromDateObject(act),
          token: cfg.sessionID,
          authorized_user: cfg.user()
        }, function (result) {
          // console.log("result: " + JSON.stringify(result));
          if ((result === undefined) || (result.status !== "ok")) {
            appl.showMessage(((result === undefined) ? R.t("global.notConnectedBody") : result.status), R.t("global.connection_error"))
          } else {
            self.appointments.removeAll()
            var appnts = result.appointments;
            if (appnts !== undefined) {
              var prev = null;
              // combine occupied time slots
              appnts.forEach(function (value) {
                var act = new self.Appointment(value)
                if (act.type === 'occupied') {
                  if (prev === null) {
                    prev = act
                  }
                  prev.end = act.end
                } else {
                  if (prev !== null) {
                    self.appointments.push(prev)
                    prev = null
                  }
                  self.appointments.push(act);
                }
              });

              if (prev !== null) {
                self.appointments.push(prev)
              }
            }
          }
        });

      }

      self.expand = function (idx) {
        if (idx.type !== 'occupied') {
          if (self.lastExpanded !== null) {
            self.lastExpanded.expanded(false)
          }
          idx.expanded(true);
          self.lastExpanded = idx;
          // console.log("opened: " + idx.begin)
        }
      }

      self.collapse = function (idx) {
        idx.expanded(false)
        self.lastExpanded = null;
      }

      self.clear = function () {
        self.appointments.removeAll()
      }

      self.loggedIn = ko.pureComputed(function () {
        return cfg.user().username
      })


      self.addAppointment = function (/*formElement*/) {
        bus.send('ch.webelexis.publicagenda', {
          request: 'insert',
          day: dt.makeCompactFromDateObject(this.date),
          time: this.begin,
          ip: cfg.loc.ip,
          patid: cfg.user().username
        }, function (result) {
          if (result.status !== "ok") {
            appl.showMessage(result.status, R.t("m.agenda.error_entry"))
          } else {
            self.loadAppointments();
          }
        });
      }

      self.deleteAppointment = function () {
        bus.send('ch.webelexis.publicagenda', {
          request: "delete",
          day: dt.makeCompactFromDateObject(this.date),
          time: String(dt.makeMinutes(this.begin)),
          ip: cfg.loc.ip,
          username: cfg.user().username
        }, function (result) {
          if (result.status !== "ok") {
            appl.showMessage(result.status, R.t("m.agenda.error_delete"))
          } else {
            self.loadAppointments();
          }
        })
      }

      self.activate = function (day) {
        if (day) {
          self.actDate(dt.makeLocalFromCompact(day))
        } else {
          self.actDate(dt.makeLocalFromDateObject(new Date()))
        }
        bus.addListener(busListener, true)
        appl.on("datepicker:change").then(function (newdate) {
          self.actDate(newdate)
          self.loadAppointments()
        })
      }
      self.deactivate = function () {
        bus.removeListener(busListener)
      }
      var busListener = function (msg) {
        if (msg === "open") {
          self.loadAppointments()
        }
      }
      self.howto(how)

    }


    return AgendaViewModel

  });
