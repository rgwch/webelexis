/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 */
define(['app/config', 'knockout', 'text!ch-webelexis-login.html', 'vertxbus'], function (config, ko, html) {
    var eb = new vertx.EventBus(config.eventbusUrl)
    eb.onopen=function(){
        console.log("eventBus open")
        $("#loginbutton").text("Anmelden")
        $("#loginbutton").removeAttr("disabled")
        config.connected=true
    }
    eb.onclose=function(){
        console.log("eventbus closed")
        $("#loginbutton").text("Nicht verbunden")
        $("#loginbutton").attr("disabled","disabled")
        config.connected=false
    }
    function LoginViewModel() {
        var self = this;
        var title = "Login"
        self.uname = ko.observable("Heinz")
        self.pwd = ko.observable("")

        self.dologin = function (formElement) {
            console.log("login "+self.uname())
            eb.send('ch.webelexis.auth.login', {
                username: self.uname,
                password: self.pwd
            }, function (result) {
                if (result.status == "ok") {
                    config.sessionid = result.sessionID;
                }else{
                    console.log("login failed")
                }
            });
        }
    }
    return {
        viewModel: LoginViewModel,
        template: html
    }
});