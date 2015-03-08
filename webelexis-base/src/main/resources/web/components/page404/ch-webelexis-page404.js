/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!ch-webelexis-page404.html'], function (ko, html) {
    function NotFoundViewModel() {
        var title="Nicht gefunden"

    }
    return {
        viewModel: NotFoundViewModel,
        template: html
    }
});