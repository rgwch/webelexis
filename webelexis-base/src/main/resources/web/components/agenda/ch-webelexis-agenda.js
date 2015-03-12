/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!ch-webelexis-agenda.html'], function(ko, bus, cfg, html) {

    function ElexisTime() {
        var self = this

        self.makeDate = function(datestring) {
            var year = datestring.substring(0, 4)
            var month = datestring.substring(4, 6) - 1
            var day = datestring.substring(6, 8)
            return new Date(year, month, day)
        }

        self.makeString = function(date) {
            var year = date.getFullYear()
            var month = (date.getMonth() + 1).toString();
            if (month.length < 2) {
                month = '0' + month
            }
            var day = date.getDate().toString();
            if (day.length < 2) {
                day = '0' + day
            }
            return year.toString() + month + day
        }

        self.makeTime = function(minutes) {
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
    }
    var convert = new ElexisTime()
    /**
     * client side representation of an Elexis-appointment
     */
        function Appointment(row) {
            var self = this;
            self.expanded = ko.observable(false)
            self.date = convert.makeDate(row[0])
            self.begin = convert.makeTime(parseInt(row[1]));
            self.end = convert
                .makeTime(parseInt(row[1]) + parseInt(row[2]));
            self.time = self.begin + "-" + self.end
            self.type = row[4]
            self.patid = row[5] ? row[5] : "no name";
            self.patName = row[6] ? row[6] : "unbekannt";
            self.firstName = row[7] ? row[7] : "unbekannt";
            self.patient = self.patName + " " + self.firstName;
            self.state = row[8];
            self.reason = row[9];
            self.displayClass = ko.pureComputed(function() {
                return self.type === 'available' ? "available" : "occupied"
            })
            self.displayText = ko.pureComputed(function() {
                return self.begin + "-" + self.end + " " + (self.type === 'available' ? "frei" : "belegt")
            })

        }


        function AgendaViewModel() {
            var self = this;
            self.title = "Agenda"

            self.appointments = ko.observableArray([]);
            self.lastExpanded = null

            self.yesterday = function() {
                var today = $('#datumfeld .input-group.date').datepicker(
                    'getDate')
                today.setTime(today.getTime() - (24 * 60 * 60000))
                $("#datum").datepicker("setDate", today)
            }
            self.tomorrow = function() {
                var today = $('#datumfeld .input-group.date').datepicker(
                    'getDate')
                today.setTime(today.getTime() + (24 * 60 * 60000))
                $("#datum").datepicker("setDate", today)
            }
            self.load = function() {
                // var selected = $("#datumfeld").val();
                var selected = self.convert.makeString($(
                    '#datumfeld .input-group.date').datepicker(
                    'getDate'))
                // console.log(selected)
                if (self.lastExpanded !== null) {
                    self.lastExpanded.expanded(false);
                    self.lastExpanded = null;
                }
                bus.send('ch.webelexis.agenda.appointments', {
                    begin: selected,
                    end: selected,
                    token: cfg.sessionID
                }, function(result) {
                    // console.log("result: " + JSON.stringify(result));
                    if (result.status !== "ok") {
                        window.alert("Verbindungsfehler: " + result.status);
                    } else {
                        self.appointments.removeAll()
                        var appnts = result.appointments;
                        var prev = null;
                        // combine occupied time slots
                        appnts.forEach(function(value) {
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
                });

            }

            self.expand = function(idx) {
                if (idx.type === 'available') {
                    if (self.lastExpanded !== null) {
                        self.lastExpanded.expanded(false)
                    }
                    idx.expanded(true);
                    self.lastExpanded = idx;
                    console.log("opened: " + idx.begin)
                }
            }

            self.collapse = function(idx) {
                idx.expanded(false)
                self.lastExpanded = null;
            }

            self.clear = function() {
                self.appointments.removeAll()
            }

            self.addAppointment = function(formElement) {
                console.log("addApp" + $("input#patname").val())
                console.log(this.begin)
                bus.send('ch.webelexis.agenda.insert', {
                    day: self.convert.makeString(this.date),
                    time: this.begin,
                    ip: cfg.loc.ip,
                    name: $("input#patname").val() + "," + $("input#patphone").val() + "," + $("input#patmail").val()
                }, function(result) {
                    // console.log("insert: " + JSON.stringify(result))
                    if (result.status !== "ok") {
                        window.alert("Fehler beim Eintragen: " + result.status)
                    } else {
                        self.load();
                    }
                });
            }

        }




    return {
        viewModel: AgendaViewModel,
        template: html
    }
});