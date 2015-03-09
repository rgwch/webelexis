/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 **/

/*
Since vertxbus does not support reconnect, we must listen for close messages, and then create a new
message bus object.
*/
define(['app/config', 'vertxbus'], function (config) {
    var bus = null;
    var reopen = setInterval(function () {
        openBus()
    }, 4000);
    var listeners = []

    function state() {
        return config.connected
    }

    function openBus() {
        if (state() === false) {
            //bus = new vertx.EventBus(config.eventbusUrl)
            var url="http://"+location.host+"/eventbus";
            bus=new vertx.EventBus(url)
            bus.onopen = function () {
                clearInterval(reopen)
                config.connected = true
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i]("open")
                }
            }
            bus.onclose = function () {
                config.connected = false
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i]("close")
                }
                bus = null
                clearInterval(reopen)
                reopen = setInterval(function () {
                    openBus()
                }, 4000)
            }
        }
    }

    openBus()
    
    return {
        connected: function () {
            return state()
        },
        addListener: function (callback) {
            listeners.push(callback)
        },
        send: function (address, message, callback) {
            bus.send(address, message, callback)
        }
    }
});