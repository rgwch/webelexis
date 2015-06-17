/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */
define(['knockout', 'config', 'i18n'], function (ko, cfg, R) {

  function AlertModel() {
    var self = this;
    self.activate = function (heading, body) {
      self.heading = ko.observable(heading)
      self.body = ko.observable(body)
    }
  }

  return AlertModel
})
