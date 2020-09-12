import { customElement } from 'aurelia-framework';
import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import {Editor} from 'mobiledoc-kit'

@inlineView(`
<template>
  <div ref="editor"></div>
</template>
`)

@customElement('mobiledoc-editor')
export class MBDEditor{
  private ed: HTMLDivElement


  public attached(){
    const editor= new Editor()
    editor.render(this.ed)
  }
  
}
