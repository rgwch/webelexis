/**
 ** This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/
define(['app/config', 'knockout', 'text!tmpl/ch-webelexis-menubar.html', 'app/eb',
    'domReady!'
], function (cfg, ko, html, bus) {

    var clientID = $("meta[name='clientID']").attr("content")
    cfg.sessionID($("meta[name='UUID']").attr("content"))

    function MenubarModel(params) {
        var self = this
        self.menuItems = ko.observableArray(cfg[params.menu])
        self.unam = ko.observable()
        self.upwd = ko.observable()
        self.loggedIn = ko.observable(false)

        self.hasRole = function (test) {
            var result = false
            test.forEach(function (item) {
                if (cfg.roles.indexOf(item) > -1) {
                    result = true
                }
            })
            return result
        }

        self.showLogin = ko.computed(function () {
            if (cfg.showLogin()) {
                if (!self.loggedIn()) {
                    return true
                }

            }
            return false
        })

        self.showLogout = ko.computed(function () {
            if (cfg.showLogin()) {
                if (self.loggedIn()) {
                    return true
                }
            }
            return false
        })

        self.doLogin = function () {
            bus.send("ch.webelexis.session.login", {
                username: self.unam(),
                password: self.upwd()
            }, function (result) {
                if (result.status === "ok") {
                    cfg.sessionID(result.sessionID)
                    if (result.roles === undefined || result.roles.length < 1) {
                        cfg.roles = ['guest']
                    } else {
                        cfg.roles = result.roles
                    }
                    self.loggedIn(true)
                    self.adaptForUser()
                    location.hash = "#agext"
                } else {
                    $("#badlogin-text").removeClass("hidden")
                }
            })
        }
        self.doLogout = function () {

            bus.send("ch.webelexis.session.logout", {
                sessionID: cfg.sessionID()
            }, function (result) {
                cfg.sessionID("")
                cfg.roles = ["guest"]
                self.unam("")
                self.upwd("")
                self.loggedIn(false)
                self.adaptForUser()
                if (result.status !== "ok") {
                    console.log("Problem beim Abmelden " + result.message)
                }
                location.hash = "#"
            })
        }

        self.adaptForUser = function () {
            self.menuItems.removeAll()
            for (var i = 0; i < cfg.modules.length; i++) {
                var item = cfg.modules[i]
                if (item.menuItem && item.active) {
                    if (self.hasRole(item.roles)) {
                        self.menuItems.push(item)
                    }
                }
            }

        }


        self.signInChanged = function (val) {
            console.log('Signin state changed to ', val);
            self.loggedIn(val)

        }

        self.userChanged = function (user) {
            if (user) {
                console.log("user now: " + user.getId() + ", " + user.getBasicProfile().getName());
                $("#logout-text").text(user.getBasicProfile().getName())
            } else {
                console.log("user now: nobody");
            }
        }

        self.refreshValues = function () {
            console.log("refreshing values");
        }

        self.initSigninV2 = function () {
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