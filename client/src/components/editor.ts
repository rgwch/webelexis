import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import { Editor as Mobiledoc, Range, Position } from 'mobiledoc-kit'

export interface IEditorCommand {
  mode: 'log' | 'replace' | 'insert'
  from: number
  data?: string
}
@inlineView(`
<template>
  <div ref="ed" class="editor"></div>
</template>
`)
export class Editor {
  private ed: HTMLDivElement
  private editor: Mobiledoc
  @bindable config

  private options = {
    placeholder: "Hier tippseln",
    focus: true,
    html: "<div></div>"

  }

  public attached() {
    this.editor = new Mobiledoc(this.options)
    this.editor.render(this.ed)
    this.editor.postDidChange(() => this.changed())
    this.config.commands(cmd => this.command(cmd))
  }

  public activate(cfg) {
    this.config = cfg
    if (cfg.html) {
      this.options.html = cfg.html
    } else if (cfg.plaintext) {
      this.options.html = cfg.plaintext
    }
    setTimeout(() => {
      let pos = this.editor.post.tailPosition()
      this.editor.run(post => {
        post.insertText(pos, " Hallo")
      })
    }, 2000)

  }

  public detached() {
    this.editor.destroy()
  }

  changed() {
    const text = this.editor.serialize()
    this.config.callback(text)
  }

  command(cmd) {
    switch (cmd.mode) {
      case "log": console.log(cmd.text); break;
      case "replace":
        this.editor.insertText(cmd.data)
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
