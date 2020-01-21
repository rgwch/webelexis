import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import { Editor as Mobiledoc, Range, Position } from 'mobiledoc-kit'

@inlineView(`
<template>
  <div ref="ed"></div>
</template>
`)
export class Editor {
  private ed: HTMLDivElement
  private editor: Mobiledoc
  @bindable config
  
  private options = {
    placeholder: "Hier tippseln",
    focus: true,
    mobiledoc: {
      version: "0.3.1",
      markups: [],
      atoms: [],
      cards: [],
      sections: [
        [1, "p", [
          [0, [], 0, "123"]
        ]]
      ]
    }
  }

  public attached() {
    this.editor = new Mobiledoc(this.options)
    this.editor.render(this.ed)
    this.editor.postDidChange(() => this.changed())
    this.config.commands(cmd=>this.command(cmd))
  }

  public activate(cfg) {
    this.config = cfg
    if (cfg.mobiledoc) {
      this.options.mobiledoc = cfg.mobiledoc
    } else if (cfg.plaintext) {
      this.options.mobiledoc.sections[0][2][0][3] = cfg.plaintext
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
        const post=this.editor.post
        let r
        if(!cmd.position){
          r=new Range(post.headPosition(),post.tailPosition())
        }else{

        }
        this.editor.run(postEditor=>{
          postEditor.deleteRange(r)
          postEditor.insertText(r.head,cmd.text)
        })
        break;
      case "insert":
        const pos=this.editor.post.headPosition()
        this.editor.run(postEditor=>{
          postEditor.insertText(pos.move(cmd.pos),cmd.text)
        })
        

      default: console.log("Bad command mode")
    }
  }
}
