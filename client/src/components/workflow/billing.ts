import { PLATFORM,bindable, autoinject, useView } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";

@autoinject
@useView(PLATFORM.moduleName("./billing.pug"))
export class Billing{
  @bindable kons;
  billings

  constructor(private bm:BillingsManager){}

  attached(){
    this.bm.getBillings(this.kons).then(result=>{
      this.billings=result
    })
  }
}
