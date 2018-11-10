import { inlineView,bindable, autoinject } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";

@inlineView(`
<template>
  <p>billings</p>
</template>
`)
@autoinject
export class Billing{
  @bindable kons;
  billings

  constructor(private bm:BillingsManager){}

  attached(){
    this.bm.getBillings(this.kons)
  }
}
