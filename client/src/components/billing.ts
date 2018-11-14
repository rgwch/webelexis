import { SelectBilling } from '../dialogs/select_billing';
import { PLATFORM,bindable, autoinject, useView } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";
import { DialogService } from "aurelia-dialog";

@autoinject
@useView(PLATFORM.moduleName("./billing.pug"))
export class Billing{
  @bindable kons;
  billings

  constructor(private bm:BillingsManager, private ds:DialogService){}

  attached(){
    this.bm.getBillings(this.kons).then(result=>{
      this.billings=result
    })
  }

  addBilling(){
    this.ds.open({viewModel: SelectBilling, model: this.kons}).whenClosed(result=>{
      if(!result.wasCancelled){
        console.log("result")
      }
    })
  }

  dragOver(event){
    event.preventDefault()
    return true;
  }
  /**
   *  a billable was dropped -> bill it
   */
  
  dragDrop(event){
    event.preventDefault()
    console.log(event)
    return true
  }
}
