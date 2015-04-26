/**
 ** This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(['app/config', 'knockout', 'text!tmpl/ch-webelexis-console.html', 'app/eb'], function (cfg, ko, html, bus) {

    function Console() {
        var self = this
        self.state = "tld"


        self.execLine = function (formElement) {
            console.log($(formElement[0]).val())
        }
    }
    return {
        viewModel: Console,
        template: html
    }
})
