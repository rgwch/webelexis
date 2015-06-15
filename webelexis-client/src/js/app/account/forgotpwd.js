/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['plugins/dialog', 'knockout', 'i18n'], function (dlg, ko, R) {

  var ForgotPwdDialog = function () {
    var that = this
    that.email = ko.observable('')
    that.autoclose = true
    that.options = ["Senden", "Abbruch"]
    that.show = function () {
      return dlg.show(that)
    }
    that.submitSendPwd = function () {
      dlg.close(that, that.email())
    }
    that.close = function () {
      dlg.close(that)
    }
  }


  return ForgotPwdDialog;

})