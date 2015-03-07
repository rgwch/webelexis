/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['knockout', 'text!ch-webelexis-agenda.html'], function (ko, html) {
    function AgendaViewModel() {
        var title="Agenda"

    }
    return {
        viewModel: AgendaViewModel,
        template: html
    }
});