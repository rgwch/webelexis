/**********
 * (c) 2015 by G. Weirich
 */
var eb;
var sessionid = ""
var convert = new ElexisTime()

function appointment(row) {
    var self = this;
    self.date = convert.makeDate(row[0])
    self.begin = convert.makeTime(parseInt(row[1]));
    self.end = convert.makeTime(parseInt(row[1]) + parseInt(row[2]));
    self.time = self.begin + "-" + self.end
    self.type= row[4]
    self.patid = row[5] ? row[5] : "no name";
    self.patName = row[6] ? row[6] : "unbekannt";
    self.firstName = row[7] ? row[7] : "unbekannt";
    self.patient = self.patName + " " + self.firstName;
    self.state = row[8];
    self.reason = row[9];
    self.displayClass=ko.pureComputed(function(){return self.type=='available' ? "available" : "occupied"})
    self.displayText=ko.pureComputed(function(){return self.type=='available' ? "frei" : "belegt"})
}

function AgendaViewModel() {
    var self = this;

    self.appointments = ko.observableArray([]);

    self.load = function () {
        //var selected = $("#datumfeld").val();
    	var selected=convert.makeString($('#datumfeld .input-group.date').datepicker('getDate'))
        console.log(selected)
        eb.send('ch.webelexis.agenda.appointments', {
            begin: selected,
            end: selected,
            resource: "gerry",
            token: sessionid
        }, function (result) {
            console.log("result: " + JSON.stringify(result));
            if (result.status != "ok") {
                self.appointments.push(new appointment("---", result.status,
                    "error"));
            } else {
            	self.appointments.removeAll()
                var appnts = result.appointments;
                appnts.forEach(function (value) {
                    self.appointments.push(new appointment(value))
                });
            }
        });


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
        var month = (date.getMonth()+1).toString();
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

function isEven(n) {
    if (n == 0) {
        return true;
    } else {
        return (n % 2 == 0);
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
$('#datumfeld .input-group.date').datepicker({
    todayBtn: "linked",
    language: "de",
    autoclose: true,
    todayHighlight: true
}); 

ko.applyBindings(new AgendaViewModel());
