/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, bindingMode, customElement, inlineView, observable, autoinject } from 'aurelia-framework';
import { I18N } from 'aurelia-i18n';
// declare var ClassicEditor: any
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/**
 * Embed the CKEditor 5
 */
@inlineView(`
<template>
  <textarea ref="textArea"></textarea>
  </template>
`)
@customElement('ck-editor')
@autoinject
export class CKEditor {
  @bindable value: string;
  @bindable public name;
  @bindable callback: (event) => string
  public textArea: HTMLTextAreaElement;
  private editor: any

  constructor(private i18:I18N){}
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
          { model: 'paragraph', title: this.i18.tr("edit.para"), class: 'ck-heading_paragraph' },
          { model: 'heading1', view: 'h1', title: this.i18.tr("edit.heading1"), class: "ck-heading_heading1" },
          { model: 'heading2', view: 'h2', title: this.i18.tr("edit.heading2"), class: "ck-heading_heading2" }
        ]
      }

    }).then(editor => {
      this.editor = editor
      editor.model.document.on("change:data", this.updateValue)
      editor.model.document.registerPostFixer(writer => {
        const changes = this.editor.model.document.differ.getChanges()
        for (const change of changes) {
          if (change.type == "insert" && change.name == "$text") {
            // console.log("Zeile: " + change.position.path[0] + ", Spalte: " + change.position.path[1] + ", Text " + change.position.textNode.data)
            if (change.position.textNode) {
              const ipos = change.position.path[1]
              const char = change.position.textNode.data.charAt(ipos)
              if (this.callback && char == '$') {
                const sel = this.editor.model.document.selection
                const range = sel.getFirstRange()
                const text = change.position.textNode.data
                const idx = text.lastIndexOf(' ') // -1 if at beginning of line
                const word = text.substring(idx + 1, ipos)
                console.log(word)
                const replacement = this.callback(word)
                const pos = change.position.getShiftedBy(word.length * -1)
                range.start = pos
                writer.remove(range)
                writer.insertText(replacement, pos)
                /*
                for(const repl of this.import(writer,replacement)){
                  writer.insertElement(repl,pos)
                }
                */

              }
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

  import(writer, rt) {
    const ops = []
    for (const line of rt.split(/\n/)) {
      ops.push(writer.createText(line))
      // ops.push(writer.createElement('paragraph'))
    }
    return ops
  }
}
