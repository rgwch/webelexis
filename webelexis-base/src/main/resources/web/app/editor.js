/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weiricg
 */

/**
 * custom binding (http://knockoutjs.com/documentation/custom-bindings.html) to embed the CKEditor in a knockout component.
 */
define(['knockout', 'cke'], function (ko, ckeditor) {

	var Editor = function (elementID) {
		var self = this;
		var myID = elementID

		self.getText = function () {
			return CKEDITOR.instances[myID].getData()
		}

		ko.bindingHandlers.ckeditor = {
			init: function (element, valueAccessor) {

				var modelValue = valueAccessor();
				var value = ko.utils.unwrapObservable(valueAccessor());
				var element$ = $(element);

				// Set initial value and create the CKEditor
				element$.html(value);
				//var editor = element$.ckeditor().editor;
				var editor = CKEDITOR.replace(element)

				// bind to change events and link it to the observable
				/*
				editor.on('change', function (e) {
					var self = this;
					if (ko.isWriteableObservable(self)) {
						self($(e.listenerData).val());
					}
				}, modelValue, element);
				 */

				/* Handle disposal if KO removes an editor
				 * through template binding */
				ko.utils.domNodeDisposal.addDisposeCallback(element,
					function () {
						editor.updateElement();
						editor.destroy();
					});
			},

			/* Hook and handle the binding updating so we write
			 * back to the observable */
			update: function (element, valueAccessor) {
				var elementid = $(element).attr("id")
				var newValue = ko.utils.unwrapObservable(valueAccessor());
				if (CKEDITOR.instances[elementid].getData() != newValue) {
					CKEDITOR.instances[elementid].setData(newValue);
				}
			}
		}
		/*
		ko.bindingHandlers.trumbowyg = {

			init: function (element, valueAccessor, allBindings) {
				$(element).trumbowyg()
				$(element).trumbowyg('html', "init")
			},

			update: function (element, valueAccessor, allBindings) {
				$(element).trumbowyg('html', textObservable())
			}

		}
		self.getText = function () {
			return self.content;
		}
		 */
		return self
	}
	return Editor;
})
