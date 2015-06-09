/*
 * This file is part of Webelexis.
 * Code to adapt jqueryui-datepicker to durandal was originally from https://gist.github.com/bforrest/8424930
 */

define(['durandal/system', 'durandal/composition', 'knockout', 'jquery-ui'],
  function (system, composition, ko) {
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

          for (var i = 0; i < props.length - 1; i++) {
            if (obj.hasOwnProperty(props[i])) {
              obj = obj[props[i]];
            }
          }

          obj[props[props.length - 1]] = $el.val();
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

        for (var i = 0; i < props.length - 1; i++) {
          if (obj.hasOwnProperty(props[i])) {
            obj = obj[props[i]];
          }
        }

        value = obj[props[props.length - 1]];
        $el.val(value);

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
  });
