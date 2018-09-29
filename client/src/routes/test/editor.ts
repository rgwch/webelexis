import { inlineView } from "aurelia-framework";

@inlineView(`
<template>
<require from="../../components/ck-editor"></require>
<div class="col">
<ck-editor value.two-way="text" callback.bind="cb"></ck-editor>
</div>
</template>
`)
export class Editor{
  text="<p>Hello, World</p><p>Goodnight, Sun</p>"
  cb=(text)=>{
    switch(text){
      case "gw": return "Gewicht";
      case "bd": return "Blutdruck";
      case "kons": return `**S:**\n**O:**\nB:\n**P:**\n`
      default: return "bubblegum";
    }
  }
}
