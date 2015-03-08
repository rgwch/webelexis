/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/eb', 'app/config', 'knockout', 'text!ch-webelexis-login.html'], function (bus, config, ko, html) {

    function adapt(connected) {
        if (connected) {
            console.log("eventBus open")
            $("#loginbutton").text("Anmelden")
            $("#loginbutton").removeAttr("disabled")
        } else {
            console.log("eventBus closed")
            $("#loginbutton").text("Nicht verbunden")
            $("#loginbutton").attr("disabled", "disabled")

        }
    }



    function LoginViewModel() {
        var self = this;
        var title = "Login"
        self.uname = ko.observable("")
        self.pwd = ko.observable("")
        
        bus.addListener(function (msg) {
            adapt(msg === "open")
        })
        adapt(bus.connected)
        self.dologin = function (formElement) {
            console.log("login " + self.uname())
            bus.send('ch.webelexis.auth.login', {
                username: self.uname(),
                password: self.pwd()
            }, function (result) {
                if (result.status === "ok") {
                    config.sessionid = result.sessionID;
                } else {
                    console.log("login failed")
                }
            });
        }
    }

    return {
        viewModel: LoginViewModel,
        template: html
    }
});