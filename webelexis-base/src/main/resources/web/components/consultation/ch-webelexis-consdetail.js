/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-consdetail.html', 'app/editor', 'app/config', 'bus', 'app/samdas'], function (ko, html, ed, cfg, bus, smd) {

	function ConsDetailModel(prm) {
		var self = this;
		self.consid = prm.params[0]
		self.contents = ko.observable()
		ed(self.contents)
		self.getText = function () {
			console.log($("#edit").trumbowyg('html'))
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
