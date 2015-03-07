/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!ch-webelexis-patdetail.html'], function (ko, html) {
    function PatDetailModel() {
        var title="Patientenliste"

    }
    return {
        viewModel: PatDetailModel,
        template: html
    }
});