/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!ch-webelexis-agenda-ext.html', 'knockout-jqueryui/datepicker', 'domReady!'], function (ko, bus, cfg, html) {


    var dateStrings = function (date) {
        var month = (date.getMonth() + 1).toString();
        if (month.length < 2) {
            month = '0' + month
        }
        var day = date.getDate().toString();
        if (day.length < 2) {
            day = '0' + day
        }
        return {
            "year": date.getFullYear().toString(),
            "month": month,
            "day": day
        }
    }


    var makeCompactString = function (date) {
        var ret = dateStrings(date)
        return ret.year + ret.month + ret.day
    }

    var makeDate = function (datestring) {
        var year = datestring.substring(0, 4)
        var month = datestring.substring(4, 6) - 1
        var day = datestring.substring(6, 8)
        return new Date(year, month, day)
    }

    var makeDateFromlocal = function (datestring) {
        var ar = datestring.split(".")
        return new Date(ar[2], ar[1] - 1, ar[0])
    }

    var makeTime = function (minutes) {
            var hours = parseInt(minutes / 60)
            var mins = (minutes - (hours * 60)).toString()
            hours = hours.toString()
            if (hours.length < 2) {
                hours = "0" + hours
            }
            if (mins.length < 2) {
                mins = "0" + mins
            }

            return hours + ":" + mins
        }
        /*
            var makeDateRFC3339 = function (date) {
                var ret = dateStrings(date)
                return ret.year + "-" + ret.month + "-" + ret.day
            }
            */
    var makeDateString = function (date) {
        var ret = dateStrings(date)
        return ret.day + "." + ret.month + "." + ret.year
    }

    /**
     * client side representation of an Elexis-appointment
     */
    function Appointment(row) {
        var app = this;
        app.expanded = ko.observable(false)
        app.date = makeDate(row[0])
        app.begin = makeTime(parseInt(row[1]));
        app.end = makeTime(parseInt(row[1]) + parseInt(row[2]));
        app.time = app.begin + "-" + app.end
        app.type = row[4]
        app.patid = row[5] ? row[5] : "no name";
        app.patName = row[6] ? row[6] : "unbekannt";
        app.firstName = row[7] ? row[7] : "unbekannt";
        app.patient = app.patName + " " + app.firstName;
        app.state = row[8];
        app.reason = row[9];
        app.displayClass = ko.pureComputed(function () {
            return app.type === 'available' ? "available" : "occupied"
        })
        app.displayText = ko.pureComputed(function () {
            return app.begin + "-" + app.end + " " + (app.type === 'available' ? "frei" : "belegt")
        })

    }

    function AgendaViewModel() {
        var self = this;
        self.tage = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]
        self.monate = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
        self.monateKurz = ["Jan", "Feb", "März", "April", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"]
        self.title = "Agenda"
        self.now = ko.observable(makeDateString(new Date()))

        self.appointments = ko.observableArray([]);
        self.lastExpanded = null

        /*
                self.actDate = ko.computed(function () {
                    return makeDateRFC3339(self.now())
                })
        */
        self.readDate = function () {
            var date = makeDateFromlocal(self.now())
            return date
        }
        self.writeDate = function (date) {
            //$("#agendaDatum input").datepicker('setDate', date)
            self.now(makeDateString(date))
        }
        self.yesterday = function () {
            self.writeDate(new Date(self.readDate().getTime() - (24 * 60 * 60000)))
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
            bus.send('ch.webelexis.agenda.appointments', {
                begin: makeCompactString(act),
                end: makeCompactString(act),
                token: cfg.sessionID()
            }, function (result) {
                console.log("result: " + JSON.stringify(result));
                if (result.status !== "ok") {
                    window.alert("Verbindungsfehler: " + result.status);
                } else {
                    self.appointments.removeAll()
                    var appnts = result.appointments;
                    if (appnts !== undefined) {
                        var prev = null;
                        // combine occupied time slots
                        appnts.forEach(function (value) {
                            var act = new Appointment(value)
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
            if (idx.type === 'available') {
                if (self.lastExpanded !== null) {
                    self.lastExpanded.expanded(false)
                }
                idx.expanded(true);
                self.lastExpanded = idx;
                console.log("opened: " + idx.begin)
            }
        }

        self.collapse = function (idx) {
            idx.expanded(false)
            self.lastExpanded = null;
        }

        self.clear = function () {
            self.appointments.removeAll()
        }

        self.addAppointment = function (/*formElement*/) {
            console.log("addApp" + $("input#patname").val())
            console.log(this.begin)
            bus.send('ch.webelexis.agenda.insert', {
                day: makeCompactString(this.date),
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
        var busListener = function (msg) {
            if (msg === "open") {
                self.loadAppointments()
            }
        }
        bus.addListener(busListener)

        if (bus.connected()) {
            self.loadAppointments();
        }

    }


    AgendaViewModel.prototype.dispose = function () {
        bus.removeListener(AgendaViewModel.busListener)
    }
    return {
        viewModel: AgendaViewModel,
        template: html
    }
});