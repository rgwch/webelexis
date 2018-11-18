import { BillingModel } from './../models/billings-model';
import { SelectBilling } from '../dialogs/select_billing';
import { PLATFORM, bindable, autoinject, useView } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";
import { DialogService } from "aurelia-dialog";
import { TouchSequence } from 'selenium-webdriver';

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
  sum:number

  constructor(private bm: BillingsManager, private ds: DialogService) { }

  attached() {
    this.loadBillings()
  }

  loadBillings(){
    this.bm.getBillings(this.kons).then(result => {
      this.billings = result.sort((a, b) => a.compare(b))
      this.recalc()
    })
  
  }

  recalc(){
    let sum=0
    for(const billing of this.billings){
      const b=billing.getBilling()
      const preis=parseFloat(b.vk_preis)
      const num=parseFloat(b.zahl)
      sum+=preis*num
    }
    this.sum=sum/100;
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
          this.recalc()
        })
      }
    })
    return true
  }

  modifyNumber(){
    const item:BillingModel=this.currentItem
    this.showmenu=false;
    const nn=prompt("Neue Zahl",this.currentItem.getBilling().zahl)
    if(nn){
      this.bm.setCount(item,nn).then(r=>{
        this.loadBillings()
      })
    }
  }

  remove(){
    this.bm.removeBilling(this.currentItem).then(i=>{
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
