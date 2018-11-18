import { BillingModel } from './../models/billings-model';
import { SelectBilling } from '../dialogs/select_billing';
import { PLATFORM, bindable, autoinject, useView } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";
import { DialogService } from "aurelia-dialog";

@autoinject
// @useView(PLATFORM.moduleName("./billing.pug"))
export class Billing {
  @bindable kons;
  billings: Array<BillingModel>
  billingdiv
  showmenu=false;
  contextmenu
  menuleft=50;
  menutop=60;
  currentItem:BillingModel

  constructor(private bm: BillingsManager, private ds: DialogService) { }

  attached() {
    this.loadBillings()
  }

  loadBillings(){
    this.bm.getBillings(this.kons).then(result => {
      this.billings = result.sort((a, b) => a.compare(b))
    })
  }
  addBilling() {
    /*
    this.ds.open({viewModel: SelectBilling, model: this.kons}).whenClosed(result=>{
      if(!result.wasCancelled){
        console.log("result")
      }
    })
    */
  }

  dragOver(event) {
    event.preventDefault()
    return true;
  }
  /**
   *  a billable was dropped -> bill it
   */

  dragDrop(event) {
    event.preventDefault()
    const data = event.dataTransfer.getData("text");
    this.bm.getBillable(data).then(billable => {
      const existing = this.billings.find(elem => elem.isBillingOf(billable))
      if (existing) {
        this.bm.increaseCount(existing).then(b=>{
         this.loadBillings()
        })
      } else {
        this.bm.createBilling(billable, this.kons, 1).then(billing => {
          const act = [].concat(this.billings)
          act.push(new BillingModel(billing))
          this.billings = act.sort((a, b) => a.compare(b))
        })
      }
    })
    return true
  }

  modifyNumber(){
    const item:BillingModel=this.currentItem
    this.bm.increaseCount(item).then(it=>{
      this.loadBillings()
      this.showmenu=false
    })
  }
  toggleMenu(item,index,event){
    this.menutop=event.clientY;
    this.menuleft=event.clientX;
    this.showmenu=!this.showmenu
    this.currentItem=item
  }
}
