//var vertx = require('vertx');
//var console= require ('vertx/console');
var eb;

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
			resource : "gerry"
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

function initialize() {
	eb = new vertx.EventBus('http://localhost:8080/eventbus');
	eb.onopen = function() {
		console.log("eventbus ok");
	}
	eb.onclose = function() {
		console.log("eventbus closed")
	}
}

initialize();
ko.applyBindings(new AgendaViewModel());