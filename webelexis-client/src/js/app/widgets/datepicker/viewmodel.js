/**
 **  This file is part of Webelexis
 ** Copyright (c) 2015 by G. Weirich
 **/

define(['knockout', 'durandal/system', 'durandal/composition', 'plugins/router', 'i18n', 'datetools', 'jquery-ui'],
  function (ko, system, composition, router, R, dt) {


    ko.bindingHandlers.ko_datepicker_handler = {
      init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        //initialize datepicker with some optional options
        system.log('ko_handler.init');
        var options = allBindingsAccessor().datepickerOptions || {
              changeYear: true,
              maxDate: 0
            },
          $el = $(element),
          modelValue = valueAccessor(),
          props = modelValue.split('.');

        $el.datepicker(options);

        //handle the field changing
        ko.utils.registerEventHandler(element, "change", function () {
          system.log('datePicker value: ' + $el.datepicker("getDate"));
          var obj = viewModel;
          /*
           for (var i = 0; i < props.length - 1; i++) {
           if (obj.hasOwnProperty(props[i])) {
           obj = obj[props[i]];
           }
           }

           obj[props[props.length - 1]] = $el.val();
           */
        });

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          $el.datepicker("destroy");
        });

      },
      update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var modelValue = valueAccessor(),
          value = null,
          props = modelValue.split('.'),
          $el = $(element),
          obj = viewModel;
        /*
         for (var i = 0; i < props.length - 1; i++) {
         if (obj.hasOwnProperty(props[i])) {
         obj = obj[props[i]];
         }
         }

         value = obj[props[props.length - 1]];
         $el.val(value);
         */
        system.log('datepicker update - value: ' + value + ', $el: ' + $el.id);
        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') === 0) {
          value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }

        var current = $el.datepicker("getDate");

        if (value - current !== 0) {
          $el.datepicker("setDate", value);
        }
      }
    };
    var Datepicker = function () {
      var self = this
      self.activate = function (settings) {
        self.tage = [R.t("datepicker:sun"), R.t("datepicker:mon"), R.t("datepicker:tue"), R.t("datepicker:wed"), R.t("datepicker:thu"), R.t("datepicker:fri"), R.t("datepicker:sat")]
        self.monate = [R.t("datepicker:january"), R.t("datepicker:february"), R.t("datepicker:march"), R.t("datepicker:april"), R.t("datepicker:may"), R.t("datepicker:june"), R.t("datepicker:july"),
          R.t("datepicker:august"), R.t("datepicker:september"), R.t("datepicker:october"), R.t("datepicker:november"), R.t("datepicker:december")]
        self.monateKurz = [R.t("datepicker:jan"), R.t("datepicker:feb"), R.t("datepicker:mar"), R.t("datepicker:apr"), R.t("datepicker:ma"), R.t("datepicker:jun"), R.t("datepicker:jul"),
          R.t("datepicker:aug"), R.t("datepicker:sep"), R.t("datepicker:oct"), R.t("datepicker:nov"), R.t("datepicker:dec")]
        self.route = settings.routeTo
        self.actDate = settings.date
        self.dateformat = "dd.mm.yy"
      }
      self.msg = function (msgid) {
        return R.t("datepicker:" + msgid)
      }
      self.readDate = function () {
        var date = dt.makeDateObjectFromLocal(self.actDate())
        return date
      }
      self.writeDate = function (date) {
        self.actDate(dt.makeLocalFromDateObject(date))
        router.navigate(self.route + dt.makeCompactFromDateObject(date))
      }
      self.forward = function (days) {
        var nDate = new Date(self.readDate().getTime() + days * 24 * 60 * 60000)
        self.writeDate(nDate)
      }
      self.backwards = function (days) {
        var nDate = new Date(self.readDate().getTime() - days * 24 * 60 * 60000)
        self.writeDate(nDate)
      }
      self.today = function () {
        self.writeDate(new Date())
      }
    }
    return Datepicker
  });
