/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-addpatient.html'], function (ko, html) {
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
            versicherunsnummer: "",
            password: "",
            pwdrepeat: ""

        })

        self.send = function () {
            console.log(JSON.stringify(self.data()))
        }
    }
    return {
        viewModel: AddPatientModel,
        template: html
    }
});