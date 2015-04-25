/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 **/

/*
Since vertxbus does not support reconnect, we must listen for close messages, and then create a new
message bus object. While the bus is closed, it will try a reconnect every 5 seconds
*/
define(['app/config', 'vertxbus'], function (config) {
    var bus = null;
    var reopen = setInterval(function () {
        openBus()
    }, 5000);
    var listeners = []

    function state() {
        return config.connected()
    }

    function openBus() {
        if (state() === false) {
            //bus = new vertx.EventBus(config.eventbusUrl)
            var url = "https://" + location.host + "/eventbus";
            bus = new vertx.EventBus(url)
            bus.onopen = function () {
                $.get("http://ipinfo.io", function (response) {
                    config.loc = response;
                }, "jsonp");
                clearInterval(reopen)
                config.connected(true)
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i]("open")
                }
            }
            bus.onclose = function () {
                config.connected(false)
                for (var i = 0; i < listeners.length; i++) {
                    listeners[i]("close")
                }
                bus = null
                clearInterval(reopen)
                reopen = setInterval(function () {
                    openBus()
                }, 5000)
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
        removeListener: function (callback) {
            var idx = listeners.indexOf(callback)
            if (idx > -1) {
                listeners.splice(idx, 1)
            }
        },
        send: function (address, message, callback) {
            bus.send(address, message, callback)
        },
        subscribe: function (address, callback) {
            bus.registerHandler(address, callback)
        },
        unsubscrbe: function (address, handler) {
            bus.unregisterHandler(address, handler)
        },
        stop: function () {
            bus.close()
            clearInterval(reopen)
        }
    }
});