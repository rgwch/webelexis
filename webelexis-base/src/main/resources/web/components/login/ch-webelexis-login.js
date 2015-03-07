/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/config', 'knockout', 'text!ch-webelexis-login.html', 'vertxbus'], function (config, ko, html) {
    var eb = new vertx.EventBus(config.eventbusUrl)

    function LoginViewModel() {
        var vm = this;
        var title = "Login"
        this.uname = ko.observable("Heinz")
        this.pwd = ko.observable("")

        function dologin() {
            eb.send('ch.webelexis.auth.login', {
                username: uname,
                password: pwd
            }, function (result) {
                if (result.status == "ok") {
                    config.sessionid = result.sessionID;
                }
            });
        }
    }
    return {
        viewModel: LoginViewModel,
        template: html
    }
});