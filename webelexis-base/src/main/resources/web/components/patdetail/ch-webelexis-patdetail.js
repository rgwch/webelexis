/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'app/datetools','text!tmpl/ch-webelexis-patdetail.html'], function(ko, bus, cfg, dt, html) {
    //var dummy = '7ba4632caba62c5b3a366'

    function PatDetailModel(params) {
        var self = this
        var patid = params.params[0]
        self.title = "Patient Detail"
        self.data = ko.observable({
            "bezeichnung1": "unbekannt"
        })
        self.displayName = ko.pureComputed(function() {
            var p=self.data()
            var bdate=dt.makeDateFromElexisDate(p.geburtsdatum)
            return p.bezeichnung1 + " " + p.bezeichnung2 + " (" + p.geschlecht + "), " + bdate + " [" + p.patientnr + "]"
        })
        self.load = function() {
            bus.send('ch.webelexis.patient', {
                "request": "summary",
                "patid": patid,
                "sessionID": cfg.sessionID
            }, function(result) {
                if ((result === undefined) || (result.status !== "ok")) {
                    window.alert("fehler bei der abfrage " + result.status);
                } else {
                    self.data(result.patient)
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