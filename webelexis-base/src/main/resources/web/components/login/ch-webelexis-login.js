/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['bus', 'app/config', 'app/router', 'knockout', 'text!tmpl/ch-webelexis-login.html', 'knockout-jqueryui/dialog'], function(bus, config, Router, ko, html) {

  var Locale = {
    de: {
      heading: "Anmeldung",
      headmsg: "Sie müssen sich zuerst im System anmelden.",
      loginButton: "Anmelden",
      loginMessage1: "Bitte melden Sie sich entweder mit E-Mail und Passwort, oder mit Ihrem Google-Konto an.",
      loginMessage2: "Bitte melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.",
      notConnectedHead: "Nicht verbunden",
      notConnectedBody: "Es besteht keine Verbindung zum Server. Warten Sie bitte einen Moment, oder versuchen Sie es später noch einmal.",
      badLogin: "Name oder Passwort waren nicht korrekt. Versuchen Sie es noch einmal",
      noaccount: 'Noch kein Konto? Klicken Sie hier, um eines zu erstellen.',
      forgotpwd: "Passwort vergessen?",
      pwdDlgHeader: "Neues Passwort anfordern",
      pwdDlgExplain: "Geben Sie bitte Ihre E-Mail-Adresse ein und klicken Sie 'Senden', um Ihr Passwort zurückzusetzen.",
      mailaddr: "Mail-Adresse (=Kontoname)",
      sendPwdSubmit: "Senden"
    }
  }
  var R = Locale[config.locale()]

  function adapt(connected) {
    if (connected) {
      //console.log("eventBus open")
      $("#loginbutton").text(R.loginButton)
      $("#loginbutton").removeAttr("disabled")
      if (config.google !== undefined) {
        $("#login-message").text(R.loginMessage1)
      } else {
        $("#login-message").text(R.loginMessage1)
      }
      $("#login-head").removeClass()
      $("#login-head").addClass("panel panel-info")

    } else {
      // console.log("eventBus closed")
      $("#loginbutton").text(R.notConnectedHead)
      $("#loginbutton").attr("disabled", "disabled")
      $("#login-message").text(R.notConnectedBody)
      $("#login-head").removeClass()
      $("#login-head").addClass("panel panel-warning")
    }
  }


  function LoginViewModel() {
    var self = this;

    self.msg = function(id) {
      return R[id]
    }
    self.uname = ko.observable("")
    self.pwd = ko.observable("")

    bus.addListener(function(msg) {
      adapt(msg === "open")
    })
    adapt(bus.connected)
    self.dologin = function( /*formElement*/ ) {
      //console.log("login " + self.uname() + "," + self.pwd() + "," + config.sessionID)
      bus.send('ch.webelexis.session.login', {
        sessionID: config.sessionID,
        mode: "local",
        username: self.uname(),
        password: self.pwd(),
        "feedback-address": "ch.webelexis.feedback." + config.sessionID
      }, function(result) {
        if (result.status === "ok") {
          //console.log("logged in")
          bus.setFeedbackAddress()
          result.user.loggedIn = true
          config.user(result.user)
            //console.log(JSON.stringify(config.user))
          window.location.hash = "#"
        } else {
          //console.log("login failed")
          $("#login-head").removeClass()
          $("#login-head").addClass("panel panel-danger")
          $("#login-message").text(R.badLogin).addClass("red")
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

    /* ------ forgot password dialog */
    self.forgotpwdDlgOpen = ko.observable(false)

    self.forgotPwd = function() {
      self.forgotpwdDlgOpen(true)
    }

    self.submitSendPwd = function(){
      
    }

  }


  return {
    viewModel: LoginViewModel,
    template: html
  }
});
