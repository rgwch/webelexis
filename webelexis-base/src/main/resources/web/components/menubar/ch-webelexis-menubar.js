/**
 ** This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/
define(['app/config', 'knockout', 'text!tmpl/ch-webelexis-menubar.html', 'app/eb', ], function(cfg, ko, html, bus) {

  var clientID = $("meta[name='clientID']").attr("content")
  cfg.sessionID = $("meta[name='UUID']").attr("content")
  var state = $("meta[name='state']").attr("content")

  function MenubarModel(params) {
    var self = this
    self.menuItems = ko.observableArray(cfg[params.menu])
    self.unam = ko.observable()
    self.upwd = ko.observable()

    // subscribe for changes of user
    cfg.user.subscribe(function() {
      self.adaptForUser()
    })

    self.connected = ko.pureComputed(function() {
      return cfg.connected()
    })
    self.showLogin = ko.computed(function() {
      if (cfg.showLogin()) {
        if (!cfg.user().loggedIn) {
          return true
        }

      }
      return false
    })

    self.showLogout = ko.computed(function() {
      if (cfg.showLogin()) {
        if (cfg.user().loggedIn) {
          return true
        }
      }
      return false
    })


    self.doLogout = function() {
      if (cfg.google !== undefined) {
        cfg.google.signOut()
      }
      bus.send("ch.webelexis.session.logout", {
        sessionID: cfg.sessionID
      }, function(result) {
        cfg.user({
          "loggedIn": false,
          "roles": ["guest"],
          "username": ""
        })
        self.unam("")
        self.upwd("")
        self.adaptForUser()
        if (result.status !== "ok") {
          console.log("Problem beim Abmelden " + result.message)
        }
        location.hash = "#"
      })
    }

    self.adaptForUser = function() {
      console.log(JSON.stringify(cfg.user()))
      self.menuItems.removeAll()
      for (var i = 0; i < cfg.modules.length; i++) {
        var item = cfg.modules[i]
        if (item.menuItem && item.active) {
          if ((item.role === "guest") || (cfg.user().roles.indexOf(item.role) !== -1)) {
            self.menuItems.push(item)
          }
        }
      }

      if (cfg.user().loggedIn) {
        //$("#logout-text").text(cfg.user().username)
        $("#logout-text").attr("title", cfg.user().username + " abmelden")
      }

    }


    self.signInChanged = function(val) {
      console.log('Signin state changed to ', val);
      cfg.user().loggedIn = val

    }

    // google user signed in
    self.userChanged = function(user) {
      if ((user !== undefined) && (user.getId() !== null)) {
        console.log("user now: " + user.getId() + ", " + user.getBasicProfile().getName());
        bus.send("ch.webelexis.session.login", {
          "mode": "google",
          "sessionID": cfg.sessionID,
          "username": user.getBasicProfile().getEmail(),
          "userid": user.getBasicProfile().getId(),
          "realname": user.getBasicProfile().getName(),
          "id_token": user.getAuthResponse().id_token,
          "client_id": clientID,
          "state": state
        }, function(result) {
          if (result.status === undefined) {
            window.alert("Verbindungsfehler")
          } else if (result.status === "unknown") {
            cfg.google.signOut()
            window.alert("Dieser google user ist an diesem System nicht bekannt. Bitte melden Sie sich zunächst an.")
          } else if (result.status === "ok") {
            $.extend(true, user, result.user)
            user.loggedIn = true;
            cfg.user(user)
            window.location.hash = "#"
          } else {
            window.alert(result.status)
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

    self.refreshValues = function() {
      self.adaptForUser()
    }

    self.initSigninV2 = function() {
      cfg.google = window.gapi.auth2.init({
        client_id: clientID,
        cookiepolicy: 'single_host_origin'
      })


      cfg.google.isSignedIn.listen(self.signInChanged);
      cfg.google.currentUser.listen(self.userChanged);

      // Sign in the user if they are currently signed in.
      if (cfg.google.isSignedIn.get() === true) {
        cfg.google.signIn();
      }

      // Start with the current live values.
      self.refreshValues();
    }

    // Initialize Google only, if we have a Google client ID
    if (clientID !== undefined && clientID !== "x-undefined") {
      window.gapi.load('auth2', self.initSigninV2)
    }


  }
  return {
    viewModel: MenubarModel,
    template: html
  }
})
