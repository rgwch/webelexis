import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import Quill from 'quill'
import '../../node_modules/quill/dist/quill.core.css'
// import '../../node_modules/quill/dist/quill.snow.css'
import '../../node_modules/quill/dist/quill.bubble.css'
import Delta from 'quill-delta'

export interface IEditorCommand {
  mode: 'log' | 'replace' | 'insert'
  from: number
  data?: string
}
@inlineView(`
<template>
    <div ref="tb" class="toolbar"></div>
    <div ref="ed" class="editor"></div>
</template>
`)
export class Editor {
  private ed: HTMLDivElement
  private tb: HTMLDivElement
  private editor
  @bindable config

  private options = {
    modules: {
      toolbar: this.tb
    },
    debug: 'info',
    placeholder: "Hier tippseln",
    readOnly: false,
    theme: 'bubble'
  }

  public attached() {
    this.editor = new Quill(this.ed, this.options)
    this.config.commands(cmd => this.command(cmd))
    this.editor.on("text-change", (delta, old, source) => {
      if (source === 'user') {
        this.config.callback(this.editor.getContents())
      }
    })
  }

  public activate(cfg) {

  }

  public detached() {
    this.editor.destroy()

  }


  command(cmd) {
    switch (cmd.mode) {
      case "log": console.log(cmd.text); break;
      case "replace":
        this.editor.setContents(cmd.data, 'api')
        /*
        const post = this.editor.post
        
        //let range: Range = this.editor.range
        let r;
        let head = post.headPosition()
        let section=head.section
        let tail=post.tailPosition()
        if (!cmd.from) {
          r = Range.create(section, 0, tail.section)
        } else {
          r = Range.create(head.move(cmd.from), head.move(cmd.to))
        }
        this.editor.run(postEditor => {
          postEditor.deleteRange(r)
          postEditor.insertText(r.head, cmd.text)
        }) */
        break;
      case "insert":
        const pos = this.editor.post.headPosition()
        this.editor.run(postEditor => {
          postEditor.insertText(pos.move(cmd.pos), cmd.text)
        })
        break;

      default: console.log("Bad command mode")
    }
  }

}
