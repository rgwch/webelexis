/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-addpatient.html'], function (ko, html) {
    function AddPatientModel() {
        var self=this
        self.title="Daten erfassen"

    }
    return {
        viewModel: AddPatientModel,
        template: html
    }
});