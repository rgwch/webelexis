/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'bus', 'config', 'datetools', 'i18n', 'durandal/app', 'datepicker'], function (ko, bus, cfg, dt, R, appl) {


  function AgendaViewModel(dprm) {
    var self = this;
    self.tage = [R.t("m.agenda.sun"), R.t("m.agenda.mon"), R.t("m.agenda.tue"), R.t("m.agenda.wed"), R.t("m.agenda.thu"), R.t("m.agenda.fri"), R.t("m.agenda.sat")]
    self.monate = [R.t("m.agenda.january"), R.t("m.agenda.february"), R.t("m.agenda.march"), R.t("m.agenda.april"), R.t("m.agenda.may"), R.t("m.agenda.june"), R.t("m.agenda.july"),
      R.t("m.agenda.august"), R.t("m.agenda.september"), R.t("m.agenda.october"), R.t("m.agenda.november"), R.t("m.agenda.december")]
    self.monateKurz = [R.t("m.agenda.jan"), R.t("m.agenda.feb"), R.t("m.agenda.mar"), R.t("m.agenda.apr"), R.t("m.agenda.ma"), R.t("m.agenda.jun"), R.t("m.agenda.jul"),
      R.t("m.agenda.aug"), R.t("m.agenda.sep"), R.t("m.agenda.oct"), R.t("m.agenda.nov"), R.t("m.agenda.dec")]
    self.title = "Agenda"
    self.msg = function (id) {
      return R[id]
    }

    /**
     * client side representation of an Elexis-appointment
     */

    self.Appointment = function (row) {
      var app = this;
      app.expanded = ko.observable(false)
      app.date = dt.makeDate(row[0])
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
         dt.makeDateString(app.date) + " um " + app.begin + " Uhr."
         */
        var ret = R.t("m.agenda.loggedin", {
          user: cfg.user().username,
          day: dt.makeDateString(app.date),
          time: app.begin
        })
        return ret;
      })


    }
    self.howto = ko.observable()
    self.now = ko.observable(dt.makeDateString(new Date()))

    self.appointments = ko.observableArray([]);
    self.lastExpanded = null

    self.readDate = function () {
      var date = dt.makeDateFromLocal(self.now())
      return date
    }
    self.writeDate = function (date) {
      //$("#agendaDatum input").datepicker('setDate', date)
      self.now(dt.makeDateString(date))
    }
    self.yesterday = function () {
      self.writeDate(new Date(self.readDate().getTime() - (24 * 60 * 60000)))
      self.loadAppointments()
    }
    self.today = function () {
      self.writeDate(new Date())
      self.loadAppointments()
    }
    self.tomorrow = function () {
      self.writeDate(new Date(self.readDate().getTime() + (24 * 60 * 60000)))
      self.loadAppointments()

    }

    self.dateChanged = function (datestring /*,widget*/) {
      self.now(datestring)
      self.loadAppointments()
    }
    self.loadAppointments = function () {
      var act = self.readDate()
      if (self.lastExpanded !== null) {
        self.lastExpanded.expanded(false);
        self.lastExpanded = null;
      }
      bus.send('ch.webelexis.publicagenda', {
        request: 'list',
        begin: dt.makeCompactString(act),
        end: dt.makeCompactString(act),
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

    self.selectedDate = "05/10/2014"

    self.addAppointment = function (/*formElement*/) {
      //console.log("addApp" + $("input#patname").val())
      //console.log(this.begin)
      bus.send('ch.webelexis.publicagenda', {
        request: 'insert',
        day: dt.makeCompactString(this.date),
        time: this.begin,
        ip: cfg.loc.ip,
        patid: cfg.user().username
      }, function (result) {
        // console.log("insert: " + JSON.stringify(result))
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
        day: dt.makeCompactString(this.date),
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
    if (dprm !== undefined && dprm.params[0] !== undefined) {
      self.now(dt.makeDateFromElexisDate(dprm.params[0]))
    }
    var busListener = function (msg) {
      if (msg === "open") {
        self.loadAppointments()
      }
    }
    self.howto("yes")
    bus.addListener(busListener, true)


  }


  AgendaViewModel.prototype.dispose = function () {
    bus.removeListener(AgendaViewModel.busListener)
  }

  return AgendaViewModel

});
