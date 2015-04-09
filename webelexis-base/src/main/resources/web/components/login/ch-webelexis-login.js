/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/eb', 'app/config', 'app/router', 'knockout', 'text!tmpl/ch-webelexis-login.html', 'domReady!'], function (bus, config, Router, ko, html) {




    function adapt(connected) {
        if (connected) {
            console.log("eventBus open")
            $("#loginbutton").text("Anmelden")
            $("#loginbutton").removeAttr("disabled")
            $("#login-message").text("Bitte melden Sie sich entweder mit Name und Passwort, oder mit Ihrem Google-Konto an.")
            $("#login-head").removeClass()
            $("#login-head").addClass("panel panel-info")

        } else {
            console.log("eventBus closed")
            $("#loginbutton").text("Nicht verbunden")
            $("#loginbutton").attr("disabled", "disabled")
            $("#login-message").text("Es besteht keine Verbindung zum Server. Warten Sie bitte einen Moment, oder versuchen Sie es später noch einmal.")
            $("#login-head").removeClass()
            $("#login-head").addClass("panel panel-warning")
        }
    }



    function LoginViewModel() {
        var self = this;
        self.uname = ko.observable("")
        self.pwd = ko.observable("")

        bus.addListener(function (msg) {
            adapt(msg === "open")
        })
        adapt(bus.connected)
        self.dologin = function ( /*formElement*/ ) {
            console.log("login " + self.uname() + "," + self.pwd() + "," + config.sessionID)
            bus.send('ch.webelexis.session.login', {
                sessionID: config.sessionID,
                mode: "local",
                username: self.uname(),
                password: self.pwd()
            }, function (result) {
                if (result.status === "ok") {
                    console.log("logged in")
                    config.user({
                            "loggedIn": true,
                            "username": self.uname(),
                            "roles": result.roles
                        })
                        //console.log(JSON.stringify(config.user))
                    location.hash = "#agext"
                } else {
                    console.log("login failed")
                    $("#login-head").removeClass()
                    $("#login-head").addClass("panel panel-danger")
                    $("#login-message").text("Name oder Passwort waren nicht korrekt. Versuchen Sie es noch einmal").addClass("red")
                }
            });

        }

        self.hasGoogle = ko.pureComputed(function () {
            return config.google !== undefined
        })
        self.googleLogin = function () {
            config.google.signIn()
        }

    }


    return {
        viewModel: LoginViewModel,
        template: html
    }
});