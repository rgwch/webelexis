/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/eb', 'app/config', 'app/router', 'knockout', 'text!tmpl/ch-webelexis-login.html'], function(bus, config, Router, ko, html) {

    var google = {}

    $("#navbar-button").bind("click", function() {
        if (config.sessionID !== null) {
            bus.send('ch.webelexis.auth.logout', {
                "sessionID": config.sessionID
            }, function(result) {
                if (result.status === "ok") {
                    config.sessionID = null
                    $("#navbar-button").text("Anmelden")
                    $(window).trigger("hashchange")
                    window.location.reload(true)
                } else {
                    window.alert("Fehler beim Abmelden")
                }
            })
        }
    })

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
        var title = "Login"
        self.uname = ko.observable("")
        self.pwd = ko.observable("")

        bus.addListener(function(msg) {
            adapt(msg === "open")
        })
        adapt(bus.connected)
        self.dologin = function(formElement) {
            console.log("login " + self.uname() + self.pwd())
            bus.send('ch.webelexis.auth.login', {
                username: self.uname(),
                password: self.pwd()
            }, function(result) {
                if (result.status === "ok") {
                    config.sessionID = result.sessionID;
                    console.log("logged in")
                    $("#navbar-button").text(self.uname() + " abmelden")
                    $(window).trigger('hashchange')
                } else {
                    console.log("login failed")
                    $("#login-head").removeClass()
                    $("#login-head").addClass("panel panel-danger")
                    $("#login-message").text("Name oder Passwort waren nicht korrekt. Versuchen Sie es noch einmal").addClass("red")
                }
            });
        }
        self.googleLogin = function(googleUser) {
            var profile = googleUser.getBasicProfile()
            console.log(profile.getId())
        }
    }

    var signInChanged = function(val) {
        console.log('Signin state changed to ', val);

    }

    var userChanged = function(user) {
        if (user) {
            console.log("user now: " + user.getId()+", "+user.getBasicProfile().getName());
        } else {
            console.log("user now: nobody");
        }
    }

    var refreshValues = function() {
        console.log("refreshing values");
    }
    var initSigninV2 = function() {
        google = window.gapi.auth2.init({
            client_id: "873064950704-p2rs933cun5v3n1d63dp6vaknlb5kufp.apps.googleusercontent.com",
            cookiepolicy: 'single_host_origin'
        })

        google.attachClickHandler(document.getElementById("googleLogin"), {}, function(googleUser) {
                console.log("Google signedIn: " + googleUser.getBasicProfile().getName());
            },
            function(error) {
                window.alert(JSON.stringify(error, undefined, 2))
            });
        google.isSignedIn.listen(signInChanged);
        google.currentUser.listen(userChanged);

        // Sign in the user if they are currently signed in.
        if (google.isSignedIn.get() === true) {
            google.signIn();
        }

        // Start with the current live values.
        refreshValues();
    }

    window.gapi.load('auth2', initSigninV2)
    /*
    if (google.isSignedIn.get()) {
        console.log("signed in: " + google.currentUser.get().getBasicProfile().getName())
    } else {
        console.log("not signed in by google");
    }
    */

    return {
        viewModel: LoginViewModel,
        template: html
    }
});