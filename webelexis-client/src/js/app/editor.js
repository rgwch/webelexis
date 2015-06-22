/**
 * This file is part of Webelexis
 * Copyright (c) 2015 by G. Weiricg
 */

/**
 * custom binding (http://knockoutjs.com/documentation/custom-bindings.html) to embed the CKEditor in a knockout component.
 */
define(['knockout', 'cke', 'durandal/app'], function (ko, ckeditor, appl) {

  var Editor = function (elementID) {
    var self = this;
    var myID = elementID;

    self.getText = function () {
      return CKEDITOR.instances[myID].getData()
    };
    // from http://stackoverflow.com/questions/20972431/ckeditor-get-previous-character-of-current-cursor-position
    function getPrevChar(editor) {
      var range = editor.getSelection().getRanges()[0],
        startNode = range.startContainer;

      if (startNode.type == CKEDITOR.NODE_TEXT && range.startOffset)
      // Range at the non-zero position of a text node.
        return startNode.getText()[range.startOffset - 1];
      else {
        // Expand the range to the beginning of editable.
        range.collapse(true);
        range.setStartAt(editor.editable(), CKEDITOR.POSITION_AFTER_START);

        // Let's use the walker to find the closest (previous) text node.
        var walker = new CKEDITOR.dom.walker(range),
          node;

        while (( node = walker.previous() )) {
          // If found, return the last character of the text node.
          if (node.type == CKEDITOR.NODE_TEXT)
            return node.getText().slice(-1);
        }
      }

      // Selection starts at the 0 index of the text node and/or there's no previous text node in contents.
      return null;
    }

    ko.bindingHandlers.ckeditor = {
      init: function (element, valueAccessor) {

        var modelValue = valueAccessor();
        var value = ko.utils.unwrapObservable(valueAccessor());
        var element$ = $(element);

        // Set initial value and create the CKEditor
        element$.html(value);
        //var editor = element$.ckeditor().editor;
        var editor = CKEDITOR.replace(element, {
          language: "de",
          contentsLanguage: "de",
          toolbar: [['Source', '-', 'Bold', 'Maximize']]
        });

        // bind to change events and link it to the observable
        /*
         editor.on("change",function(event){
         var data=editor.getData() // fetch HTML
         var sel=editor.getSelection() // current position
         var curpos=sel.getStartElement()
         debugger
         var char=getPrevChar(editor)
         })
         */
        /**
         * command for macro-processing in webelexis
         */
        editor.addCommand("webelexisShortcut", {
          exec: function (edt, data) {
            var actText = edt.getSelection().getRanges()[0].startContainer.$;
            var words = actText.textContent.split(/\s+/);
            var lastWord = words[words.length - 1];
            console.log(lastWord);
            appl.trigger("editor:macro", lastWord)
          }
        });
        /**
         * execute macro-prozessing with ctrl-space
         */
        editor.setKeystroke(CKEDITOR.CTRL + 32, "webelexisShortcut");

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
        var elementid = $(element).attr("id");
        var newValue = ko.utils.unwrapObservable(valueAccessor());
        if (CKEDITOR.instances[elementid].getData() != newValue) {
          CKEDITOR.instances[elementid].setData(newValue);
        }
      }
    };

    return self
  };
  return Editor;
});
