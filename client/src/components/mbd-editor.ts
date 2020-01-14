import { bindable, bindingMode, inlineView } from 'aurelia-framework';
import {Mobiledoc} from 'mobiledoc-kit'

@inlineView(`
<template>
  <div id="mbdeditor" ref="textarea"></div>
</template>
`)

export class MBDEditor{
  private element: HTMLDivElement

  public attached(){
    const editor= new Mobiledoc.Editor()
    editor.render(this.element)
  }
}
