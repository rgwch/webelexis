/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'bus', 'config','datetools', 'datepicker'], function(ko, bus, cfg, dt) {

  var Locale={
    de: {
      sun: "So",
      mon: "Mo",
      tue: "Di",
      wed: "Mi",
      thu: "Do",
      fri: "Fr",
      sat: "Sa",
      january: "Januar",
      february: "Februar",
      march: "März",
      april: "April",
      may: "Mai",
      june: "Juni",
      july: "Juli",
      august: "August",
      september: "September",
      october: "Oktober",
      november: "November",
      december: "Dezember",
      jan: "Jan",
      feb: "Feb",
      mar: "März",
      apr:"Apr",
      ma:"Mai",
      jun:"Jun",
      jul:"Jul",
      aug:"Aug",
      sep:"Sep",
      oct:"Okt",
      nov:"Nov",
      dec:"Dec",
      yesterday: "Einen Tag zurück",
      today:"Heute",
      tomorrow: "Einen Tag weiter",
      openCal:"Kalender öffnen",
      makeAppnt:"Termin vereinbaren",
      deleteAppnt:"Termin löschen",
      cancel:"Abbrechen",
      disclaimer: "Die Verwendung dieser Website geschieht ohne Gewähr. Für fehlerhaft übertragene Termine wird keine Haftung übernommen. In wichtigen Fällen bestätigen Sie Ihren Termin bitte telefonisch.",
      rightHeading:"Termin direkt online eintragen",
      rightFooter:"Bitte beachten Sie, dass wir bei einer Terminvereinbarung über diese Website Ihre IP-Adresse und weitere Angaben speichern. Sämtliche Daten werden nach dem vereinbarten Termin wieder gelöscht."

    }
  }

  var R=Locale[cfg.locale()]

  function AgendaViewModel(dprm) {
    var self = this;
    self.tage = [R.sun, R.mon, R.tue, R.wed, R.thu, R.fri, R.sat]
    self.monate = [R.january, R.february, R.march, R.april, R.may, R.june, R.july, R.august, R.september, R.october, R.november, R.december]
    self.monateKurz = [R.jan, R.feb, R.mar, R.apr, R.ma, R.jun, R.jul, R.aug, R.sep, R.oct, R.nov, R.dec]
    self.title = "Agenda"
    self.msg=function(id){
      return R[id]
    }

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
    self.howto=ko.observable()
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

    self.selectedDate="05/10/2014"

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
    if (dprm !== undefined && dprm.params[0] !== undefined) {
      self.now(dt.makeDateFromElexisDate(dprm.params[0]))
    }
    var busListener = function(msg) {
      if (msg === "open") {
        self.loadAppointments()
      }
    }
    self.howto("yes")
    bus.addListener(busListener, true)


  }


  AgendaViewModel.prototype.dispose = function() {
    bus.removeListener(AgendaViewModel.busListener)
  }

  return AgendaViewModel

});
