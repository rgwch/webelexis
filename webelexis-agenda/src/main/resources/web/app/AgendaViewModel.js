define([ 'knockout' ], function(ko) {

	var self = this;

	self.appointments = ko.observableArray([]);
	self.title = "Webelexis-Agenda"
	self.lastExpanded = null

	self.load = function() {
		// var selected = $("#datumfeld").val();
		var selected = convert.makeString($('#datumfeld .input-group.date')
				.datepicker('getDate'))
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
			console.log("result: " + JSON.stringify(result));
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

	/**
	 * client side representation of an Elexis-appointment
	 */
	function appointment(row) {
		var self = this;
		self.expanded = ko.observable(false)
		self.date = convert.makeDate(row[0])
		self.begin = convert.makeTime(parseInt(row[1]));
		self.end = convert.makeTime(parseInt(row[1]) + parseInt(row[2]));
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

	function addAppointment(formElement) {
		console.log("addApp" + $("input#patname").val())
		console.log(this.begin)
		eb.send('ch.webelexis.agenda.insert', {
			day : convert.makeString(this.date),
			time : this.begin,
			ip : loc.ip,
			name : $("input#patname").val() + "," + $("input#patphone").val()
					+ "," + $("input#patmail").val()
		}, function(result) {
			console.log("insert: " + JSON.stringify(result))
			if (result.status != "ok") {
				alert("Fehler beim Eintragen: " + result.message)
			} else {
				avm.load();
			}
		});
	}
	return this;
});