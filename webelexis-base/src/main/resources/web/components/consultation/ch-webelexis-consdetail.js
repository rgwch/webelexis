/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-consdetail.html', 'app/editor', 'app/config', 'bus', 'app/samdas'], function (ko, html, ed, cfg, bus, smd) {

	function ConsDetailModel(prm) {
		var self = this;
		self.consid = prm.params[0]
		self.contents = ko.observable("loading..")
		var edit = ed("edit")
		self.getText = function () {
			var htmltext = edit.getText()
			console.log(htmltext)
			var samdastext = smd.samdas(htmltext)
			console.log(samdastext)
			window.history.back()
		}

		self.cancel = function () {
			window.history.back()
		}
		self.loadCons = function () {
			bus.send("ch.webelexis.patient.cons", {
				action   : "get",
				consid   : self.consid,
				sessionID: cfg.sessionID
			}, function (result) {
				if (result.status === undefined) {
					window.alert("no response from server")
				} else if (result.status === "ok") {
					var cons = result.result
					self.contents(smd.html(cons.entry))
				} else {
					window.alert("error " + result.message)
				}
			})

		}
		self.busListener = function (msg) {
			if (msg === "open") {
				self.loadCons()
			}
		}
		bus.addListener(self.busListener, true)
	}

	ConsDetailModel.prototype.dispose = function () {
		bus.removeListener(ConsDetailModel.busListener)
	}

	return {
		viewModel: ConsDetailModel,
		template : html
	}
});
