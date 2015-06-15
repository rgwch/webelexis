/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(['plugins/router', 'durandal/system', 'durandal/app', 'account/changepwd', 'i18n', 'underscore', 'config', 'knockout', 'bus', 'bootstrap'],
  function (router, system, appl, pwd, R, _, cfg, ko, bus) {

    var routes = function (roles) {
      var ret = []
      _.each(cfg.modules, function (module) {
        if (module.active) {
          if ((module.role === 'guest') || (roles.indexOf(module.role) !== -1)) {
            ret.push({
              route: module.route,
              hash: module.hash,
              title: module.title,
              moduleId: module.location,
              nav: module.nav
            })
          }
        }
      })
      return ret
    }

    var adaptForUser = function () {
      router.reset()
      router.map(routes(cfg.user().roles))
      router.buildNavigationModel()
      if (cfg.user().loggedIn) {
        $('#displayName').html(cfg.user().username + "<span class='caret'></span>")
      }

    }

    var clientID = $("meta[name='clientID']").attr("content")
    cfg.sessionID = $("meta[name='UUID']").attr("content")
    var state = $("meta[name='state']").attr("content")

    cfg.user.subscribe(function () {
      adaptForUser()
    })

    var initSigninV2 = function () {
      cfg.google = window.gapi.auth2.init({
        client_id: clientID,
        cookiepolicy: 'single_host_origin'
      })


      cfg.google.isSignedIn.listen(signInChanged);
      cfg.google.currentUser.listen(userChanged);

      // Sign in the user if they are currently signed in.
      if (cfg.google.isSignedIn.get() === true) {
        cfg.google.signIn();
      }

      // Start with the current live values.
      adaptForUser();
    }

    var signInChanged = function (val) {
      console.log('Signin state changed to ', val);
      cfg.user().loggedIn = val

    }

    // google user signed in
    var userChanged = function (user) {
      if ((user !== undefined) && (user.getId() !== null) && (user.getAuthResponse() !== null)) {
        console.log("user now: " + user.getId() + ", " + user.getBasicProfile().getName());
        bus.send("ch.webelexis.session.login", {
          "mode": "google",
          "sessionID": cfg.sessionID,
          "username": user.getBasicProfile().getEmail(),
          "userid": user.getBasicProfile().getId(),
          "realname": user.getBasicProfile().getName(),
          "id_token": user.getAuthResponse().id_token,
          "client_id": clientID,
          "state": state,
          "feedback-address": "ch.webelexis.feedback." + cfg.sessionID
        }, function (result) {
          if (result.status === undefined) {
            window.alert("Verbindungsfehler")
          } else if (result.status === "unknown user") {
            cfg.google.signOut()
            //window.alert("Dieser google user ist an diesem System nicht bekannt. Bitte melden Sie sich zunächst an.")
            window.location.hash = "#alert/ghead/gbody"
          } else if (result.status === "ok") {
            $.extend(true, user, result.user)
            user.loggedIn = true;
            bus.setFeedbackAddress()
            cfg.user(user)
            window.location.hash = "#"
          } else {
            window.alert("userchange error: " + result.status + " " + result.message)
          }

        })
      } else {
        console.log("user now: nobody");
        cfg.user({
          "loggedIn": false,
          "username": "",
          "access_token": {},
          "id_token": {},
          "email": "",
          "userid": "",
          "roles": ["guest"]
        })
      }
    }
    return {
      "router": router,
      "changePwd": function () {
        new pwd().show().then(function (oldpwd, newpwd) {
          if (oldpwd !== undefined && newpwd !== undefined) {
            system.log(oldpwd + ", " + newpwd)
            bus.send("ch.webelexis.patient.changepwd", {
              "username": cfg.user.username,
              "old-pwd": oldpwd,
              "new-pwd": newpwd
            }, function (result) {
              if (result === undefined) {
                appl.showMessage(R.t("global.timeout"), R.t("global.connection_error"))
              } else {
                if (result.status === "ok") {
                  appl.showMessage(R.t("global.chpwdOk"), R.t("global.chpwdHeader"))
                } else {
                  appl.showMessage(result.status + " " + result.message, R.t("global.error"))
                }
              }
            })
          }
        })
      },
      connected: function () {
        return true
      },
      locale: function (text) {
        return R.t("global." + text)
      },
      showLogin: ko.computed(function () {
        if (cfg.showLogin()) {
          if (!cfg.user().loggedIn) {
            return true
          }

        }
        return false
      }),
      showLogout: ko.computed(function () {
        if (cfg.showLogin()) {
          if (cfg.user().loggedIn) {
            return true
          }
        }
        return false
      }),
      doLogout: function () {
        if (cfg.google !== undefined) {
          cfg.google.signOut()
        }
        bus.send("ch.webelexis.session.logout", {
          sessionID: cfg.sessionID
        }, function (result) {
          bus.clearFeedbackAddress()
          cfg.user({
            "loggedIn": false,
            "roles": ["guest"],
            "username": ""
          })
          adaptForUser()
          if (result.status !== "ok") {
            system.log("Problem beim Abmelden " + result.message)
          }
          window.location.hash = "#"
          window.location.reload()
        })
      },
      activate: function () {
        /* Initialize 'Signin with Google', if we have a Google client ID */
        if (clientID !== undefined && clientID !== "x-undefined") {
          window.gapi.load('auth2', initSigninV2)
        }
        var initialRoutes = routes(["guest"])
        router.map(initialRoutes).buildNavigationModel()
        return router.activate();
      }
    }
  });
