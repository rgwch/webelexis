import { bindable, bindingMode, customElement, inlineView } from 'aurelia-framework';
//import 'ckeditor/ckeditor' // doesn't work, include it in index.ejs
declare const CKEDITOR

@inlineView(`
<template>
  <textarea changed.delegate="updateValue()" ref="textArea"></textarea>
</template>
`)
@customElement('ck-editor')
export class CKEditor {
  @bindable({ defaultBindingMode: bindingMode.twoWay }) public value;
  @bindable public callback
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
    editor.on('key', evt => {
      if (evt.data.domEvent.$.key == '$') {
        const ed = evt.editor
        const sel = ed.getSelection()
        const range = sel.getRanges()[0]
        const ipos = range.endOffset
        const text = range.endContainer.$.data
        let off = 0
        const idx = text.lastIndexOf(' ') // -1 if at beginning of line
        if (idx == -1) {
          off = 1
        }
        const word = text.substring(idx + 1, ipos)
        const replacement = this.callback(word)

        const r2 = range.clone()
        const nn = r2.getBoundaryNodes()
        r2.setStart(nn.startNode, ipos - word.length)
        r2.setEnd(nn.endNode, ipos)
        r2.deleteContents(true)
        r2.select()
        ed.insertHtml(replacement)
        return false;
      }
    })
    editor.setData(this.value)
  }


  public updateValue() {
    this.value = this.textArea.value;
  }
}
