/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-agenda.html', 'app/datetools', 'knockout-jqueryui/datepicker'], function(ko, bus, cfg, html, dt) {


  function AgendaViewModel() {
    var self = this;
    self.tage = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
    self.monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
    self.monateKurz = ["Jan", "Feb", "März", "April", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"]
    self.title = "Agenda"
      /**
       * client side representation of an Elexis-appointment
       */

    self.Appointment = function(row) {
      var app = this;
      app.expanded = ko.observable(false)
      app.date = dt.makeDate(row[0])
      app.begin = dt.makeTime(parseInt(row[1]));
      app.end = dt.makeTime(parseInt(row[1]) + parseInt(row[2]));
      app.time = app.begin + "-" + app.end
      app.type = row[3]
      app.patid = row[4]
      app.displayClass = ko.pureComputed(function() {
        return app.type === 'available' ? "available" : "occupied"
      })
      app.displayText = ko.pureComputed(function() {
        var tr = app.begin + "-" + app.end + " "
        if (app.type === "available") {
          tr += "frei"
        } else if (app.type === 'user') {
          tr += "Ihr Termin"
        } else {
          tr += "belegt"
        }
        return tr
      })

      app.loggedInText = ko.pureComputed(function() {
        var ret = "Sie sind angemeldet als " + cfg.user().username + ". Bitte bestätigen Sie den gewünschten Termin am " +
          dt.makeDateString(app.date) + " um " + app.begin + " Uhr."
        return ret;
      })


    }
    self.now = ko.observable(dt.makeDateString(new Date()))

    self.appointments = ko.observableArray([]);
    self.lastExpanded = null

    self.readDate = function() {
      var date = dt.makeDateFromLocal(self.now())
      return date
    }
    self.writeDate = function(date) {
      //$("#agendaDatum input").datepicker('setDate', date)
      self.now(dt.makeDateString(date))
    }
    self.yesterday = function() {
      self.writeDate(new Date(self.readDate().getTime() - (24 * 60 * 60000)))
      self.loadAppointments()
    }
    self.today = function() {
      self.writeDate(new Date())
      self.loadAppointments()
    }
    self.tomorrow = function() {
      self.writeDate(new Date(self.readDate().getTime() + (24 * 60 * 60000)))
      self.loadAppointments()

    }

    self.dateChanged = function(datestring /*,widget*/ ) {
      self.now(datestring)
      self.loadAppointments()
    }
    self.loadAppointments = function() {
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
      }, function(result) {
        // console.log("result: " + JSON.stringify(result));
        if ((result === undefined) || (result.status !== "ok")) {
          window.alert("Verbindungsfehler: " + (result === undefined) ? "Anwendung nicht erreichbar" : result.status);
        } else {
          self.appointments.removeAll()
          var appnts = result.appointments;
          if (appnts !== undefined) {
            var prev = null;
            // combine occupied time slots
            appnts.forEach(function(value) {
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

    self.expand = function(idx) {
      if (idx.type !== 'occupied') {
        if (self.lastExpanded !== null) {
          self.lastExpanded.expanded(false)
        }
        idx.expanded(true);
        self.lastExpanded = idx;
        // console.log("opened: " + idx.begin)
      }
    }

    self.collapse = function(idx) {
      idx.expanded(false)
      self.lastExpanded = null;
    }

    self.clear = function() {
      self.appointments.removeAll()
    }

    self.loggedIn = ko.pureComputed(function() {
      return cfg.user().username
    })


    self.addAppointment = function( /*formElement*/ ) {
      //console.log("addApp" + $("input#patname").val())
      //console.log(this.begin)
      bus.send('ch.webelexis.publicagenda', {
        request: 'insert',
        day: dt.makeCompactString(this.date),
        time: this.begin,
        ip: cfg.loc.ip,
        patid: cfg.user().username
      }, function(result) {
        // console.log("insert: " + JSON.stringify(result))
        if (result.status !== "ok") {
          window.alert("Fehler beim Eintragen: " + result.status)
        } else {
          self.loadAppointments();
        }
      });
    }

    self.deleteAppointment = function() {
      bus.send('ch.webelexis.publicagenda', {
        request: "delete",
        day: dt.makeCompactString(this.date),
        time: String(dt.makeMinutes(this.begin)),
        ip: cfg.loc.ip,
        username: cfg.user().username
      }, function(result) {
        if (result.status !== "ok") {
          window.alert("Fehler beim Löschen")
        } else {
          self.loadAppointments();
        }
      })
    }
    var busListener = function(msg) {
      if (msg === "open") {
        self.loadAppointments()
      }
    }
    bus.addListener(busListener)

    if (bus.connected()) {
      self.loadAppointments();
    }

  }


  AgendaViewModel.prototype.dispose = function() {
    bus.removeListener(AgendaViewModel.busListener)
  }

  return {
    viewModel: AgendaViewModel,
    template: html
  }
});
