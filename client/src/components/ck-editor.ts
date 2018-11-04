import {bindable, bindingMode, customElement, inlineView} from 'aurelia-framework';
import 'ckeditor'
declare const CKEDITOR

@inlineView(`
<template>
  <textarea changed.delegate="updateValue()" ref="textArea"></textarea>
</template>
`)
@customElement('ck-editor')
export class CKEditor {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public value;
  @bindable public name;
  public textArea: HTMLTextAreaElement;

  private element: any;

  public static = [Element];
  constructor(element) {
    this.element = element;
  }

  public attached() {
    let editor = CKEDITOR.replace(this.textArea);
    editor.on('change', (e) => {
      this.value = e.editor.getData();
    });
    editor.setData(this.value)
  }


  public updateValue() {
    this.value = this.textArea.value;
  }
}
