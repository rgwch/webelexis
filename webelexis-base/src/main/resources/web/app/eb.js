/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 **/

// jshint -W117
/*
Since vertxbus does not support reconnect, we must listen for close messages, and then create a new
message bus object. While the bus is closed, it will try a reconnect every 5 seconds
*/
define(['app/config', 'vertxbus'], function(config) {
  var bus = null;
  var reopen = setInterval(function() {
    openBus()
  }, 5000);
  var listeners = []

  var timeoutHandler = function(msg) {
    config.user({
        "loggedIn": false,
        "roles": ["guest"],
        "username": ""
      })
      //window.alert("Wegen Timeout ausgeloggt")
    window.location.hash = "#alert/sysmsg/timeout"
  }


  function state() {
    return config.connected()
  }

  function openBus() {
    if (state() === false) {
      //bus = new vertx.EventBus(config.eventbusUrl)
      var url = location.origin + "/eventbus";
      bus = new vertx.EventBus(url)
      bus.onopen = function() {

        /*
        $.get("http://ipinfo.io", function(response) {
          config.loc = response;
        }, "jsonp");
        */
        clearInterval(reopen)
        config.connected(true)
        for (var i = 0; i < listeners.length; i++) {
          listeners[i]("open")
        }
      }
      bus.onclose = function() {
        config.connected(false)
        for (var i = 0; i < listeners.length; i++) {
          listeners[i]("close")
        }
        bus = null
        clearInterval(reopen)
        reopen = setInterval(function() {
          openBus()
        }, 5000)
      }
    }
  }

  openBus()

  return {
    connected: function() {
      return state()
    },
    /* Add a bus listener. Will be called with a String "open" or "close"
     param: callback: The Listener, directCall: If true: will be called immediately
     after adding with the actual value */
    addListener: function(callback, directCall) {
      listeners.push(callback)
      if (directCall !== undefined && directCall === true) {
        if (state()) {
          callback("open")
        } else {
          callback("close")
        }
      }
    },
    removeListener: function(callback) {
      var idx = listeners.indexOf(callback)
      if (idx > -1) {
        listeners.splice(idx, 1)
      }
    },
    send: function(address, message, callback) {
      bus.send(address, message, callback)
    },
    subscribe: function(address, callback) {
      bus.registerHandler(address, callback)
    },
    unsubscribe: function(address, handler) {
      bus.unregisterHandler(address, handler)
    },
    stop: function() {
      bus.close()
      clearInterval(reopen)
    },

    setFeedbackAddress: function() {
      if (state()) {
        var ret = "ch.webelexis.feedback." + config.sessionID
        bus.registerHandler(ret, timeoutHandler)
        return ret
      } else {
        bus.send("hello")
        return null;
      }
    },
    clearFeedbackAddress: function() {
      if (state()) {
        bus.unregisterHandler("ch.webelexis.feedback." + config.sessionID, timeoutHandler)
      }
    }

  }
});
