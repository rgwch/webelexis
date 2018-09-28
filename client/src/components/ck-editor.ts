import { bindable, bindingMode, customElement, inlineView, observable } from 'aurelia-framework';
declare var ClassicEditor: any
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@inlineView(`
<template>
  <textarea ref="textArea"></textarea>
  </template>
`)
@customElement('ck-editor')
export class CKEditor {
  @bindable value: string;
  @bindable public name;
  @bindable callback: (event) => string
  public textArea: HTMLTextAreaElement;
  private editor: any

  /*
    valueChanged(newValue:string,oldValue:string){
      if(this.editor){
        this.editor.setData(newValue)
      }
    }
  */

  public attached() {
    console.log("ckeditor attached")
    this.textArea.innerHTML = this.value
    ClassicEditor.create(this.textArea, {
      toolbar: ['heading', '|', 'bold', 'italic', 'undo', 'redo', 'bulletedList'],
      heading: {
        options: [
          { model: 'paragraph', title: "Absatz", class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: "Überschrift 1", class: "ck-heading_heading1" },
          { model: 'heading2', view: 'h2', title: "Überschrift 2", class: "ck-heading_heading2" }
        ]
      }

    }).then(editor => {
      this.editor = editor
      editor.model.document.on("change:data", this.updateValue)
      editor.model.document.registerPostFixer(writer => {
        const changes = this.editor.model.document.differ.getChanges()
        for (const change of changes) {
          if (change.type == "insert") {
            console.log("Zeile: " + change.position.path[0] + ", Spalte: " + change.position.path[1] + ", Text " + change.position.textNode._data)
            const sel = this.editor.model.document.selection
            const range = sel.getFirstRange()
            const char=change.position.textNode._data.charAt(change.position.path[1])
            if (this.callback && char=='$') {
              const replacement = this.callback(change.position.textNode._data)
              const pos = change.position.getShiftedBy(-2)
              range.start = pos
              writer.remove(range)
              writer.insertText(replacement, pos)

            }
          }
        }
      })
      // const a=Array.from( this.editor.ui.componentFactory.names() );
      //console.log(JSON.stringify(a))

    }).catch(error => {
      console.log("couldn't create editor " + error)
    })
  }


  public detached() {
    console.log("ckeditor detached")
    this.editor.model.document.off("change:data", this.updateValue)
    this.editor.destroy().then(() => {
      delete this.editor
    }).catch(err => {
      console.log("couldn't destroy editor " + err)
    })
  }

  updateValue = (event, name, newValue, oldValue) => {
    const path = event.path
    const sel = path[0].selection
    this.value = this.editor.getData()
  }
}
