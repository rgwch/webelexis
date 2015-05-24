define(['knockout', 'text!tmpl/ch-webelexis-conslist.html', 'bus', 'app/config', 'underscore'], function (ko, html, bus, cfg, _) {

    var Locale = {
        de: {
            loading: "Lade Daten...",
            parameter: "Parameter",
            twelvemonths: "12 Monate",
            older: "Älter",
            actual: "Aktuell",
            details: "Details",
            verlauf: "Verlauf",
            sparkline: "Verlauf",
            noanswer: "Keine Antwort vom Server"
        }
    }

    function KonsList(prm) {
        var self = this
        self.patid = prm.params[0]
        self.R = Locale[cfg.locale()]
        self.entries=ko.observableArray([])

        self.loadConses = function () {
            bus.send("ch.webelexis.patient.cons", {
                patid: self.patid,
                sessionID: cfg.sessionID
            }, function (result) {
                if (result === undefined) {
                    alert(self.R.noanswer)
                }else if(result.status === "ok"){
                    _.each(result.results,function(cons){self.entries.push(cons.entry)})
                }else{
                    alert("error "+result.message)
                }
            })
        }
        self.busListener = function (msg) {
            if (msg === "open") {
                self.loadConses()
            }
        }
        bus.addListener(self.busListener, true)

    }

    KonsList.prototype.dispose = function () {
        bus.removeListener(KonsList.busListener)
    }
    return {
        viewModel: KonsList,
        template: html
    }
})
;
