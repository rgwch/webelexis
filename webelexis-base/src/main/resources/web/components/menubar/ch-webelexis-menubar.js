define(['app/config', 'knockout', 'text!ch-webelexis-menubar.html', 'app/eb', 'domReady!'], function (cfg, ko, html, bus) {
    function MenubarModel(params) {
        var self = this
        self.menuItems = ko.observableArray(cfg[params.menu])
            //console.log(self.menu()[0].baseUrl+","+self.menu()[0].title)
            //self.menuItems=ko.observableArray([{baseUrl: '#agenda', title: 'Agenda'},{baseUrl: 'haha', title: 'HiHi'}])
        self.unam = ko.observable("hans")
        self.upwd = ko.observable()
        self.doLogin = function () {
            bus.send("ch.webelexis.auth.login", {
                username: self.unam(),
                password: self.upwd()
            }, function (result) {
                if (result.status === "ok") {
                    cfg.sessionID = result.sessionID
                    if (result.roles === undefined || result.roles.length > 1) {
                        cfg.roles = []
                    } else {
                        cfg.roles = result.roles
                    }
                    self.menuItems.clear()
                    for (var i = 0; i < cfg[params.menu].length; i++) {
                        var item = cfg[params.menu][i]
                        var newMenu = []
                        item.roles.forEach(function (element) {
                            if (cfg.roles.indexOf(element) !== -1) {
                                newMenu.push(item)
                            }
                        })
                    }
                    $("#loginform").addClass("hidden")
                    $("#logged-in-text").removeClass("hidden")
                } else {
                    $("#badlogin-text").removeClass("hidden")
                }
            })
        }
        self.doLogout = function () {
            bus.send("ch.webelexis.auth.logout", {
                sessionID: cfg.sessionID
            }, function (result) {
                if(result.status==="ok"){
                    cfg.sessionID=""
                    cfg.roles=[]
                    $("#loginform").removeClass("hidden")
                    $("#logged-in-text").addClass("hidden")
                }
            })
        }
    }
    return {
        viewModel: MenubarModel,
        template: html
    }
})