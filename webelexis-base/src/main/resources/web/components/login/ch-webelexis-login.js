/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/eb', 'app/config', 'app/router', 'knockout', 'text!ch-webelexis-login.html'], function (bus, config, Router, ko, html) {

    function adapt(connected) {
        if (connected) {
            console.log("eventBus open")
            $("#loginbutton").text("Anmelden")
            $("#loginbutton").removeAttr("disabled")
            $("#login-message").text("Bitte melden Sie sich zuerst an.")
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
        var title = "Login"
        self.uname = ko.observable("")
        self.pwd = ko.observable("")
        
        bus.addListener(function (msg) {
            adapt(msg === "open")
        })
        adapt(bus.connected)
        self.dologin = function (formElement) {
            console.log("login " + self.uname() + self.pwd())
            bus.send('ch.webelexis.auth.login', {
                username: self.uname(),
                password: self.pwd()
            }, function (result) {
                if (result.status === "ok") {
                    config.sessionID = result.sessionID;
                    console.log("logged in")
                    $("#navbar-info").text("angemeldet als: "+self.uname())
                    $(window).trigger('hashchange')
                } else {
                    console.log("login failed")
                    $("#login-head").removeClass()
                    $("#login-head").addClass("panel panel-danger")
                    $("#login-message").text("Name oder Passwort waren nicht korrekt. Versuchen Sie es noch einmal").addClass("red")
                }
            });
        }
    }

    return {
        viewModel: LoginViewModel,
        template: html
    }
});