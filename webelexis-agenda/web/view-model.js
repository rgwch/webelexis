//var vertx = require('vertx');
//var console= require ('vertx/console');
var eb;
var sessionid = ""
var convert = new ElexisTime()

function appointment(row) {
    var self = this;
    self.date = convert.makeDate(row[0])
    var test = parseInt(row[1]);
    self.begin = convert.makeTime(parseInt(row[1]));
    self.end = convert.makeTime(parseInt(row[1]) + parseInt(row[2]));
    self.time = self.begin + "-" + self.end
    self.patid = row[3];
    self.patName = row[4];
    self.firstName = row[5];
    self.patient = self.patName + " " + self.firstName;
    self.type = row[6];
    self.state = row[7];
    self.reason = row[8];
}

function AgendaViewModel() {
    var self = this;

    self.appointments = ko.observableArray([]);

    self.load = function () {
        var selected = $("#datumfeld").val();
        console.log(selected)
        eb.send('ch.webelexis.agenda.appointments', {
            begin: $("#datumfeld").val(),
            end: $("datumfeld").val(),
            resource: "gerry",
            token: sessionid
        }, function (jsonResult) {
            self.appointments.removeAll()
            var result = /* JSON.parse */ (jsonResult)
            console.log("result: " + JSON.stringify(result));
            if (result.status != "ok") {
                self.appointments.push(new appointment("---", result.status,
                    "error"));
            } else {
                var appnts = result.results;
                appnts.forEach(function (value) {
                    self.appointments.push(new appointment(value))
                });
            }
        });


    }

    self.isEven = function(n) {
        return isNumber(n) && (n % 2 == 0);
    }
    
    self.clear = function () {
        self.appointments.removeAll()
    }
}

function ElexisTime() {
    var self = this

    self.makeDate = function (datestring) {
        var year = datestring.substring(0, 4)
        var month = datestring.substring(4, 6)
        var day = datestring.substring(6, 8)
        return new Date(year, month, day)
    }

    self.makeString = function (date) {
        var year = date.getFullYear()
        var month = date.getMonth().toString();
        if (month.length < 2) {
            month = '0' + month
        }
        var day = date.getDate().toString();
        if (day.length < 2) {
            day = '0' + day
        }
        return year.toString() + month + day
    }

    self.makeTime = function (minutes) {
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

function dologin(name, pwd) {
    eb.send('ch.webelexis.auth.login', {
        username: name,
        password: pwd
    }, function (result) {
        if (result.status == "ok") {
            sessionid = result.sessionID;
            $("#badlogin").hide()
            $("#username").val("")
            $("#pwd").val("")
            $("#userLogin").hide()
            $("#userLogout").show()
            $("#loggedInUser").text(name)
        } else {
            $("#badlogin").show()
        }
    });
}

function dologout() {
    eb.send('ch.webelexis.auth.logout', {
        "sessionID": sessionid
    })
    sessionid = ""
    $("#userLogin").show()
    $("#userLogout").hide()

}

function initialize() {
    eb = new vertx.EventBus('http://localhost:8080/eventbus');
    eb.onopen = function () {
        console.log("eventbus ok");
    }
    eb.onclose = function () {
        console.log("eventbus closed")
    }
}


$("#userLogout").hide();
$("#badlogin").hide();
initialize();
$('.datepicker').datepicker({
    'format': "dd.mm.yyyy",
    'autoclose': true,
    'language': "de",
    todayBtn: "linked",
    todayHighlight: true
})
$('.datepicker').datepicker('setDate', new Date())
ko.applyBindings(new AgendaViewModel());