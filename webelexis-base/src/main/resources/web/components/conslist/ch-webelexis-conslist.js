define(['knockout', 'text!tmpl/ch-webelexis-conslist.html', 'bus', 'app/config', 'underscore', 'app/datetools', 'app/samdas'], function (ko, html, bus, cfg, _, dt, smd) {

	var Locale = {
		de: {
			loading     : "Lade Daten...",
			parameter   : "Parameter",
			twelvemonths: "12 Monate",
			older       : "Älter",
			actual      : "Aktuell",
			details     : "Details",
			verlauf     : "Verlauf",
			sparkline   : "Verlauf",
			noanswer    : "Keine Antwort vom Server"
		}
	}

	function KonsList(prm) {
		var self = this
		self.patid = prm.params[0]
		self.R = Locale[cfg.locale()]
		self.entries = ko.observableArray([])

		self.loadConses = function () {
			bus.send("ch.webelexis.patient.cons", {
				action   : "list",
				patid    : self.patid,
				sessionID: cfg.sessionID
			}, function (result) {
				if (result === undefined) {
					window.alert(self.R.noanswer)
				} else if (result.status === "ok") {
					self.entries(_.map(result.results, function (cons) {
							return ({id: cons.id, date: dt.makeDateFromElexisDate(cons.date), text: smd.plaintext(cons.entry)})
						})
					)
				} else {
					window.alert("error " + result.message)
				}
			})
		}
		self.busListener = function (msg) {
			if (msg === "open") {
				self.loadConses()
			}
		}
		bus.addListener(self.busListener, true)

	}

	KonsList.prototype.dispose = function () {
		bus.removeListener(KonsList.busListener)
	}
	return {
		viewModel: KonsList,
		template : html
	}
})
;
