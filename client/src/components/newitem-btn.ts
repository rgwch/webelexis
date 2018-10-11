import { element } from 'aurelia-protractor-plugin/protractor';
import { inlineView, bindable } from "aurelia-framework";

@inlineView(`
<template>
  <button type="button" class="btn" disabled.bind="disabled">
    <i class="fas fa-asterisk createbutton"></i>
  </button>
</template>
`)
export class NewItemButton{

  @bindable disabled:boolean=false

}
