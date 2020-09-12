import { inlineView } from "aurelia-framework";
import { LabelProvider } from "components/smartlist";

@inlineView(`
<template>
  <require from="components/smartlist"></require>
  <smartlist labelprovider.bind="lp" elements.bind="items"></smartlist>
</template>
`)
export class Smartlist_{
  items=[{text:"eins",dis:true},{text:"zwei",dis:true}]

  lp:LabelProvider={
    getHtml: obj=>`<b>${obj.text}</b> <span style="font-size:small" click.trigger="swit">${obj.dis}</span>`,
    getText: obj=>obj.text
  }
}

