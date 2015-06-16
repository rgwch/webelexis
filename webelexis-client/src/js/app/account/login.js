/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */

// Login Module
define(['bus', 'config', 'knockout', 'i18n', './forgotpwd', 'durandal/app', 'durandal/system'], function (bus, config, ko, R, pwd, appl, system) {


  var adapt = function (connected) {

    if (connected) {
      system.log("eventBus open")
      $("#loginbutton").text(R.t('m.login.loginButton'))
      $("#loginbutton").removeAttr("disabled")
      if (config.google !== undefined) {
        $("#login-message").text(R.t('m.login.loginMessage1'))
      } else {
        $("#login-message").text(R.t('m.login.loginMessage1'))
      }
      $("#login-head").removeClass()
      $("#login-head").addClass("panel panel-info")

    } else {
      system.log("eventBus closed")
      $("#loginbutton").text(R.t('global.notConnectedHead'))
      $("#loginbutton").attr("disabled", "disabled")
      $("#login-message").text(R.t('global.notConnectedBody'))
      $("#login-head").removeClass()
      $("#login-head").addClass("panel panel-warning")
    }
  }


  function LoginViewModel() {
    var self = this;

    self.msg = function (id) {
      return R.t("m.login." + id)
    }
    self.uname = ko.observable("")
    self.pwd = ko.observable("")


    self.dologin = function (/*formElement*/) {
      //console.log("login " + self.uname() + "," + self.pwd() + "," + config.sessionID)
      bus.send('ch.webelexis.session.login', {
        sessionID: config.sessionID,
        mode: "local",
        username: self.uname(),
        password: self.pwd(),
        "feedback-address": "ch.webelexis.feedback." + config.sessionID
      }, function (result) {
        if (result.status === "ok") {
          //console.log("logged in")
          bus.setFeedbackAddress()
          result.user.loggedIn = true
          config.user(result.user)
          //console.log(JSON.stringify(config.user))
          window.location.hash = "#"
        } else {
          system.log("login failed")
          if (result.message === "no session") {
            appl.showMessage(R.t("global.reload"), R.t("global.connection_error"))
          } else {
            $("#login-head").removeClass()
            $("#login-head").addClass("panel panel-danger")
            $("#login-message").text(R.t('m.login.badLogin')).addClass("red")
          }
        }
      });

    }

    self.hasGoogle = ko.pureComputed(function () {
      return config.google !== undefined
    })
    self.googleLogin = function () {
      $("#gbutton").attr("src", "images/Blue_signin_Long_pressed_32dp_v3.png")
      config.google.signIn()
    }

    self.google_mouseOver = function () {
      $("#gbutton").attr("src", "images/Blue_signin_Long_focused_32dp_v3.png")
    }

    self.google_mouseOut = function () {
      $("#gbutton").attr("src", "imgages/Blue_signin_Long_normal_32dp_v3.png")
    }

    /* ------ forgot password dialog */

    self.forgotPwd = function () {
      new pwd().show().then(function (response) {
        if (response !== undefined && response.length > 3) {
          bus.send("ch.webelexis.patient.lostpwd", {
            "username": response,
            "sessionId": config.sessionID
          }, function (result) {
            if (result === undefined) {
              window.alert("communication error")
            } else if (result.status === "ok") {
              appl.showMessage(R.t('m.login.sendingPwd'), R.t('global.chpwd'))
            } else {
              appl.showMessage(R.t('m.login.badUsername'), R.t('global.chpwd'))
            }
          })
        }
      })
    }
    var busListener = function () {
      adapt(bus.connected())
      system.log("bus Listener: " + bus.connected())
    }


    self.activate = function () {
      bus.addListener(busListener, false)

    }

    self.deactivate = function () {
      bus.removeListener(LoginViewModel.busListener)
    }
  }

  return LoginViewModel
});
