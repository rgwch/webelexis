/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'app/eb', 'app/config', 'text!tmpl/ch-webelexis-addpatient.html', 'jquery', 'validate', 'domReady!'], function (ko, bus, cfg, html, $) {
    function AddPatientModel() {
        var self = this
        self.title = "Daten erfassen"
        self.data = ko.observable({
            vorname: "",
            name: "",
            geburtsdatum: "",
            strasse: "",
            plz: "",
            ort: "",
            email: "",
            telefon: "",
            mobil: "",
            krankenkasse: "",
            versicherungsnummer: "",
            password: "",
            pwdrepeat: ""
        })

        self.send = function () {
            console.log(JSON.stringify(self.data()))
            var payload = self.data()
            payload.sessionID = cfg.sessionID
            bus.send("ch.webelexis.patient.add", payload, function (result) {
                if (result === undefined) {
                    alert("Verbindungsfehler")
                } else if (result.status === "ok") {
                    console.log("ok")
                } else {
                    console.log(result.status)
                    console.log(result.message)
                }
            })
        }

        self.accountDisplay = ko.observable("pneu")
        $("form").validate()

    }
    return {
        viewModel: AddPatientModel,
        template: html
    }
});