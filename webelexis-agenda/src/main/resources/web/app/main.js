/*******************************************************************************
 * * This file is part of Webelexis ** * (c) 2015 by G. Weirich **
 ******************************************************************************/

define([ 'jquery', 'knockout', 'vertxbus', 'datepicker', 'datepicker.de' ],
		function($, ko) {
			// change the url to match your setup
			var url = "http://localhost:2015/eventbus"

			var eb;
			var sessionid = ""
			var convert = new ElexisTime()
			var avm = new AgendaViewModel()
			var loc = {}

			function AgendaViewModel() {
				var self = this;

				self.appointments = ko.observableArray([]);
				self.title = "Webelexis-Agenda"
				self.lastExpanded = null

				self.yesterday = function() {
					var today = $('#datumfeld .input-group.date').datepicker(
							'getDate')
					today.setTime(today.getTime()-(24*60*60000))
					$("#datum").datepicker("setDate", today)
				}
				self.tomorrow = function() {
					var today = $('#datumfeld .input-group.date').datepicker(
							'getDate')
					today.setTime(today.getTime()+(24*60*60000))
					$("#datum").datepicker("setDate", today)
				}
				self.load = function() {
					// var selected = $("#datumfeld").val();
					var selected = convert.makeString($(
							'#datumfeld .input-group.date').datepicker(
							'getDate'))
					// console.log(selected)
					if (self.lastExpanded != null) {
						self.lastExpanded.expanded(false);
						self.lastExpanded = null;
					}
					eb.send('ch.webelexis.agenda.appointments', {
						begin : selected,
						end : selected,
						token : sessionid
					}, function(result) {
						// console.log("result: " + JSON.stringify(result));
						if (result.status != "ok") {
							alert("Verbindungsfehler: " + result.status);
						} else {
							self.appointments.removeAll()
							var appnts = result.appointments;
							var prev = null;
							// combine occupied time slots
							appnts.forEach(function(value) {
								var act = new appointment(value)
								if (act.type == 'occupied') {
									if (prev == null) {
										prev = act
									}
									prev.end = act.end
								} else {
									if (prev != null) {
										self.appointments.push(prev)
										prev = null
									}
									self.appointments.push(act);
								}
							});
							if (prev != null) {
								self.appointments.push(prev)
							}
						}
					});

				}

				self.expand = function(idx) {
					if (idx.type == 'available') {
						if (self.lastExpanded != null) {
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
					eb.send('ch.webelexis.agenda.insert', {
						day : convert.makeString(this.date),
						time : this.begin,
						ip : loc.ip,
						name : $("input#patname").val() + ","
								+ $("input#patphone").val() + ","
								+ $("input#patmail").val()
					}, function(result) {
						// console.log("insert: " + JSON.stringify(result))
						if (result.status != "ok") {
							alert("Fehler beim Eintragen: " + result.message)
						} else {
							avm.load();
						}
					});
				}

			}
			/**
			 * client side representation of an Elexis-appointment
			 */
			function appointment(row) {
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
					return self.type == 'available' ? "available" : "occupied"
				})
				self.displayText = ko.pureComputed(function() {
					return self.begin + "-" + self.end + " "
							+ (self.type == 'available' ? "frei" : "belegt")
				})

			}

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

			function isEven(n) {
				if (n == 0) {
					return true;
				} else {
					return (n % 2 == 0);
				}

			}

			function dologin(name, pwd) {
				eb.send('ch.webelexis.auth.login', {
					username : name,
					password : pwd
				}, function(result) {
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
					"sessionID" : sessionid
				})
				sessionid = ""
				$("#userLogin").show()
				$("#userLogout").hide()

			}

			function initialize() {
				$.get("http://ipinfo.io", function(response) {
					loc = response;
				}, "jsonp");
				eb = new vertx.EventBus(url);
				eb.onopen = function() {
					console.log("eventbus ok");
					$("#datum").datepicker("setDate", new Date())
					$(".h1").html(avm.title)
					avm.load()
				}
				eb.onclose = function() {
					console.log("eventbus closed")
					alert("Die Verbindung zum Server ist abgebrochen")
				}
			}

			$("#userLogout").hide();
			$("#badlogin").hide();
			initialize();
			$('#datumfeld .input-group.date').datepicker({
				todayBtn : "linked",
				language : "de",
				autoclose : true,
				todayHighlight : true

			})
			ko.applyBindings(avm);

			return this;
		});