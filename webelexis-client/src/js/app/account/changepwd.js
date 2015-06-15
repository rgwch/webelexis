/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weirich
 */

define(['knockout', 'plugins/dialog', 'i18n'], function (ko, dlg, R) {
  var ChangePwdDialog = function () {
    var self = this
    self.oldPwd = ko.observable()
    self.newPwd = ko.observable()
    self.repPwd = ko.observable()
    self.show = function () {
      return dlg.show(self)
    }
    self.close = function () {
      dlg.close(self)
    }
    self.submitChPwd = function () {
      if (self.repPwd() === self.newPwd()) {
        dlg.close(self, self.oldPwd(), self.newPwd())
      } else {
        dlg.showMessage(R.t("m.add.warn_pwd_match"), R.t("global.error"))
      }
    }
  }

  return ChangePwdDialog;
})