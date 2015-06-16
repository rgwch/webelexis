/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'durandal/system', 'datetools', 'plugins/router', 'bus', 'config', 'i18n', 'datepicker'], function (ko, system, dt, router, bus, cfg, R) {


  /**
   * client side representation of an Elexis-appointment
   * 0 tag,1 beginn,2 dauer, 3 bereich, 4 termintyp,5 terminID,6 PatientID,7 Terminstatus,8 Grund,9 Kontakt-bez, 10 Kontakt-bez2
   */

  function AgendaViewModel() {
    var self = this;
    self.msg = function (id) {
      return R.t("m.agenda." + id)
    }
    self.Appointment = function (row) {
      var app = this;
      app.expanded = ko.observable(false)
      app.date = dt.makeDate(row[0])
      app.begin = dt.makeTime(parseInt(row[1]));
      app.end = dt.makeTime(parseInt(row[1]) + parseInt(row[2]));
      app.time = app.begin + "-" + app.end
      app.type = row[4]
      app.terminID = row[5]
      app.patientID = row[6]
      app.state = row[7]
      app.reason = row[8]
      app.firstName = row[10]
      app.lastName = row[9]
      app.birthdate = row[11] ? dt.makeDateString(dt.makeDate(row[11])) : ""

      app.displayName = app.lastName ? (app.lastName + " " + app.firstName + ", " + app.birthdate) : app.PatientID
      app.displayClass = ko.pureComputed(function () {
        if (app.type === 'available') {
          return "available"
        } else if (app.type === "Reserviert") {
          return "locked"
        } else {
          return "occupied"
        }

      })
      app.displayText = ko.pureComputed(function () {
        var ret = app.begin + "-" + app.end + " "
        if (app.type === "Reserviert") {
          ret += "reserviert"
        } else if (app.type === "available") {
          ret += "(frei)"
        } else if (app.lastName === undefined) {
          ret += app.patientID
        } else {
          ret += app.displayName
        }
        return ret
      })
      app.isPatientEntry = ko.pureComputed(function () {
        if (app.type === "Reserviert" || app.type === "available") {
          return false
        } else {
          return true
        }
      })
    }
    self.now = ko.observable(dt.makeDateString(new Date()))

    self.appointments = ko.observableArray([]);
    self.lastExpanded = null
    self.resources = ko.observableArray([])
    self.resource = ko.observable()

    self.loadResources = function () {
      self.resources.removeAll()
      bus.send("ch.webelexis.privateagenda", {
        sessionID: cfg.sessionID,
        request: 'resources'
      }, function (result) {
        if (result.status === "ok") {
          result.data.forEach(function (item) {
            self.resources.push({
              display: item.title,
              resource: item.resource
            })
          })
          self.resource(self.resources()[0])
          self.loadAppointments()
        }
      })
    }

    self.readDate = function () {
      var date = dt.makeDateFromLocal(self.now())
      return date
    }
    self.writeDate = function (date) {
      //window.history.pushState({}, "", "#detail/" + dt.makeCompactString(date))
      router.navigate("#detail/" + dt.makeCompactString(date))
      system.log("pushed " + date)
      self.now(dt.makeDateString(date))
      self.loadAppointments()
    }
    self.today = function () {
      self.writeDate(new Date())
    }
    self.yesterday = function () {
      var dayback = new Date(self.readDate().getTime() - (24 * 60 * 60000))
      self.writeDate(dayback)
    }
    self.tomorrow = function () {
      var dayfwd = new Date(self.readDate().getTime() + (24 * 60 * 60000))
      self.writeDate(dayfwd)
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
      bus.send('ch.webelexis.privateagenda', {
        request: 'list',
        resource: self.resource().resource,
        begin: dt.makeCompactString(act),
        end: dt.makeCompactString(act),
        sessionID: cfg.sessionID
      }, function (result) {
        // console.log("result: " + JSON.stringify(result));
        if ((result.status === undefined) || result.status !== "ok") {
          window.alert("Verbindungsfehler: " + result.status === undefined ? "keine Verbindung" : result.status);
        } else {
          self.appointments.removeAll()
          var appnts = result.appointments;
          if (appnts !== undefined) {
            appnts.forEach(function (value) {
              var act = new self.Appointment(value)
              self.appointments.push(act);
            })
          }

        }
      })
    }
    self.expand = function (idx) {
      if (idx.isPatientEntry) {
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


    self.update = function () {
      // console.log("submit")
    }

    self.addAppointment = function (/*formElement*/) {
      //console.log("addApp" + $("input#patname").val())
      //console.log(this.begin)
      bus.send('ch.webelexis.publicagenda', {
        request: 'insert',
        day: dt.makeCompactString(this.date),
        time: this.begin,
        //ip: cfg.loc.ip,
        name: $("input#patname").val() + "," + $("input#patphone").val() + "," + $("input#patmail").val()
      }, function (result) {
        // console.log("insert: " + JSON.stringify(result))
        if (result.status !== "ok") {
          window.alert("Fehler beim Eintragen: " + result.status)
        } else {
          self.load();
        }
      });
    }

    self.patdetail = function (idx) {
      window.location.hash = "#patdetail/" + idx.patientID
    }
    self.labview = function (idx) {
      window.location.hash = "#labview/" + idx.patientID
    }
    self.consview = function (idx) {
      window.location.hash = "#conslist/" + idx.patientID
    }

    self.activate = function (day) {
      bus.addListener(busListener, true)
      if (day) {
        self.writeDate(dt.makeDate(day))
      } else {
        self.writeDate(new Date())
      }
    }


    var busListener = function (msg) {
      if (msg === "open") {
        self.loadResources()
      }
    }

    self.deactivate = function () {
      bus.removeListener(busListener)
    }
  }

  return AgendaViewModel

});
