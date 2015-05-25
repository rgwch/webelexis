define(['knockout', 'text!tmpl/ch-webelexis-conslist.html', 'bus', 'app/config', 'underscore', 'app/datetools'], function (ko, html, bus, cfg, _, dt) {

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
                action: "list",
                patid: self.patid,
                sessionID: cfg.sessionID
            }, function (result) {
                if (result === undefined) {
                    window.alert(self.R.noanswer)
                }else if(result.status === "ok"){
                    self.entries(_.map(result.results,function(cons){
                        var parser=new window.DOMParser()
                        var xml=parser.parseFromString(cons.entry,"text/xml")
                        var text=xml.getElementsByTagName("text")[0]
                        return({id: cons.id, date: dt.makeDateFromElexisDate(cons.date), text: text.innerHTML})
                      })
                    )
                }else{
                    window.alert("error "+result.message)
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
