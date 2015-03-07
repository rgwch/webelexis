/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!ch-webelexis-patlist.html'], function (ko, html) {
    function PatlistModel() {
        var title="Patientenliste"

    }
    return {
        viewModel: PatlistModel,
        template: html
    }
});