/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-patdetail.html'], function(ko, bus, cfg, html) {
    var dummy = '7ba4632caba62c5b3a366'

        function PatDetailModel() {
            var self = this
            self.title = "Patient Detail"
            self.patient = ko.observable({})


            self.load = function() {
                bus.send('ch.webelexis.patient', {
                    "request": "summary",
                    "patid": dummy,
                    "sessionID": cfg.sessionID
                }, function(result) {
                    if ((result === undefined) || (result.status !== "ok")) {
                        alert("fehler bei der abfrage " + result.status);
                    } else {
                        self.patient(result.patient)
                    }
                });
            }
            self.load()
        }
        
    return {
        viewModel: PatDetailModel,
        template: html
    }
});