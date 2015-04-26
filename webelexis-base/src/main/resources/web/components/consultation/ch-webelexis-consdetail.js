/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!tmpl/ch-webelexis-consdetail.html'], function (ko, html) {
    function ConsDetailModel() {
        var title="Konsultation"

    }
    return {
        viewModel: ConsDetailModel,
        template: html
    }
});
