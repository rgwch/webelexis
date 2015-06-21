/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'i18n'], function (ko, R) {

  function AlertModel() {
    var self = this;
    self.activate = function (heading, body) {
      self.heading = ko.observable(R.t("alerts:" + heading))
      self.body = ko.observable(R.t("alerts:" + body))
    }
  }

  return AlertModel
})
