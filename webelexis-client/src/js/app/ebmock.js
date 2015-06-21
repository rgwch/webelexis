/**
 ** This file is part of Webelexis
 ** (c) 2015 by G. Weirich
 **/

/**
 * A test replacement for eb.js. Will simply mock EventBus functions
 */
define(function (require) {
  var listeners = []
  var mocks = {}
  return {
    /** configure the mock answers */
    mock: function (address, message, response) {
      mocks[address] = {
        message: message,
        response: response
      }
    },
    connected: function () {
      return true
    },
    addListener: function (callback, directCall) {
      listeners.push(callback)
      if (directCall !== undefined && directCall === true) {
        if (state()) {
          callback("open")
        } else {
          callback("close")
        }
      }
    },
    removeListener: function (callback) {
      var idx = listeners.indexOf(callback)
      if (idx > -1) {
        listeners.splice(idx, 1)
      }
    },
    send: function (address, message, callback) {

    },
    sunscribe: function (address, callback) {

    },
    stop: function () {

    },
    setFeedbackAddress: function () {

    },
    clearFeedbackAddress: function () {

    }
  }

})
