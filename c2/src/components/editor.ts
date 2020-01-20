import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import { Editor as Mobiledoc } from 'mobiledoc-kit'

@inlineView(`
<template>
  <div ref="ed"></div>
</template>
`)
export class Editor {
  private ed: HTMLDivElement
  private editor: Mobiledoc
  private data
  @bindable public model = {
    placeholder: "Hier tippen",
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
    this.editor = new Mobiledoc(this.model)
    this.editor.render(this.ed)
    let dat=this.data
    this.editor.postDidChange(()=>this.changed())
  }

  public activate(data) {
    this.data = data
    this.model = this.data.options

  }

  changed(){
    const text=this.editor.serialize()
    this.data.callback(text)
  }
}
