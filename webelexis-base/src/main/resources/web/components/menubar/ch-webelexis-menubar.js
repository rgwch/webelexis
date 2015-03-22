/**
 ** This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/
define(['app/config', 'knockout', 'text!tmpl/ch-webelexis-menubar.html', 'app/eb',
    'domReady!'
], function (cfg, ko, html, bus) {

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
            bus.send("ch.webelexis.auth.login", {
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
                } else {
                    $("#badlogin-text").removeClass("hidden")
                }
            })
        }
        self.doLogout = function () {
            bus.send("ch.webelexis.auth.logout", {
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
    }
    return {
        viewModel: MenubarModel,
        template: html
    }
})