//var vertx = require('vertx');
//var console= require ('vertx/console');
var eb;
var sessionid=""
var convert=new ElexisTime()
	
function appointment(from, to, reason) {
	var self = this;
	self.from = ko.observable(from);
	self.until = ko.observable(to);
	self.reason = reason;
}
function AgendaViewModel() {
	var self = this;

	self.appointments = ko.observableArray([ new appointment("08:00", "08:30",
			"quatsch") ]);

	self.load = function() {
		eb.send('ch.webelexis.agenda.appointments', {
			begin : "20150212",
			end : "20150213",
			resource : "gerry",
			token: sessionid
		}, function(jsonResult) {
			// self.appointments.clear
			var result = /* JSON.parse */(jsonResult)
			console.log("result: " + JSON.stringify(result));
			if (result.status != "ok") {
				self.appointments.push(new appointment("---", result.status,
						"error"));
			} else {
				var appnts=result.results;
				appnts.forEach(function(value) {
					self.appointments.push(new appointment(value[0], value[1], value[2]))
				});
			}
		});
	}
}

function ElexisTime(){
	var self=this
	
	self.makeDate=function(datestring){
		var year=datestring.substring(0,4)
		var month=datestring.substring(4,6)
		var day=datestring.substring(6,8)
		return new Date(year,month,day)
	}
	
	self.makeString=function(date){
		var year=date.getFullYear()
		var month=date.getMonth().toString();
		if(month.length<2){
			month='0'+month
		}
		var day=date.getDate().toString();
		if(day.length<2){
			day='0'+day
		}
		return year.toString()+month+day
	}
	
	self.makeTime=function(minutes){
		var hours=parseInt(minutes/60)
		var mins=minutes-(hours*60)
		return hours.toString()+":"+mins
	}
}

function dologin(name,pwd){
	eb.send('ch.webelexis.auth.login', {
		username: name,
		password: pwd
	}, function(result){
		if(result.status== "ok"){
			sessionid=result.sessionID;
			$("#username").val("")
			$("#pwd").val("")
			$("#userLogin").hide()
			$("#userLogout").show()
			$("#loggedInUser").text(name)
		}
	});
}

function dologout(){
	eb.send('ch.webelexis.auth.logout', {
		"sessionID": sessionid
	})
	sessionid=""
	$("#userLogin").show()
	$("#userLogout").hide()

}

function initialize() {
	eb = new vertx.EventBus('http://localhost:8080/eventbus');
	eb.onopen = function() {
		console.log("eventbus ok");
	}
	eb.onclose = function() {
		console.log("eventbus closed")
	}
}


$("#userlogout").hide()
initialize();
ko.applyBindings(new AgendaViewModel());