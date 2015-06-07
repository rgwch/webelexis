/*
 * This file is part of Webelexis. Copyright (c) 2015 by G. Weirich
 */

define(['plugins/http', 'durandal/app', 'knockout', './datepicker'], function (http, app, ko) {
  return {
    displayName: 'Using the ko handler and observable plugin to pick a date',
    selectedDate: ko.observable(''),
    activate: function () {
    }
  };
});
