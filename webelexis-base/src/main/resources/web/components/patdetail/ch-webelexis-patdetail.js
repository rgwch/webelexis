/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'app/datetools', 'text!tmpl/ch-webelexis-patdetail.html'], function (ko, bus, cfg, dt, html) {
    //var dummy = '7ba4632caba62c5b3a366'

    function PatDetailModel(params) {
        var self = this
        var patid = params.params[0]
        self.title = "Patient Detail"
        self.data = ko.observable({
            "bezeichnung1": "unbekannt"
        })
        self.displayName = ko.pureComputed(function () {
            var p = self.data()
            var now = new Date()
            var bdate = dt.makeDate(p.geburtsdatum)
            var diff = now.getTime() - bdate.getTime();
            var age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
            return p.bezeichnung1 + " " + p.bezeichnung2 + " (" + p.geschlecht + "), " + dt.makeDateString(bdate) + " (" + age + ") [" + p.patientnr + "]"
        })
        self.address = ko.pureComputed(function () {
            var p = self.data()
            return p.strasse + ", " + p.plz + " " + p.ort + "; " + p.telefon1 + ", " + p.telefon2 + ", " + p.natelnr
        })
        self.load = function () {
            bus.send('ch.webelexis.patient.detail', {
                "request": "summary",
                "patid": patid,
                "sessionID": cfg.sessionID
            }, function (result) {
                if ((result === undefined) || (result.status !== "ok")) {
                    window.alert("fehler bei der abfrage " + result.status + result.message);
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