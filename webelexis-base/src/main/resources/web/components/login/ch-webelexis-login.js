/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/eb', 'app/config', 'app/router', 'knockout', 'text!tmpl/ch-webelexis-login.html'], function(bus, config, Router, ko, html) {


  function adapt(connected) {
    if (connected) {
      console.log("eventBus open")
      $("#loginbutton").text("Anmelden")
      $("#loginbutton").removeAttr("disabled")
      if (config.google !== undefined) {
        $("#login-message").text("Bitte melden Sie sich entweder mit E-Mail und Passwort, oder mit Ihrem Google-Konto an.")
      } else {
        $("#login-message").text("Bitte melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.")
      }
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

    bus.addListener(function(msg) {
      adapt(msg === "open")
    })
    adapt(bus.connected)
    self.dologin = function( /*formElement*/ ) {
      console.log("login " + self.uname() + "," + self.pwd() + "," + config.sessionID)
      bus.send('ch.webelexis.session.login', {
        sessionID: config.sessionID,
        mode: "local",
        username: self.uname(),
        password: self.pwd()
      }, function(result) {
        if (result.status === "ok") {
          console.log("logged in")
          result.user.loggedIn = true
          config.user(result.user)
            //console.log(JSON.stringify(config.user))
          window.location.hash = "#"
        } else {
          console.log("login failed")
          $("#login-head").removeClass()
          $("#login-head").addClass("panel panel-danger")
          $("#login-message").text("Name oder Passwort waren nicht korrekt. Versuchen Sie es noch einmal").addClass("red")
        }
      });

    }

    self.hasGoogle = ko.pureComputed(function() {
      return config.google !== undefined
    })
    self.googleLogin = function() {
      $("#gbutton").attr("src", "img/Blue_signin_Long_pressed_32dp_v3.png")
      config.google.signIn()
    }

    self.google_mouseOver = function() {
      $("#gbutton").attr("src", "img/Blue_signin_Long_focused_32dp_v3.png")
    }

    self.google_mouseOut = function() {
      $("#gbutton").attr("src", "img/Blue_signin_Long_normal_32dp_v3.png")
    }

  }


  return {
    viewModel: LoginViewModel,
    template: html
  }
});
