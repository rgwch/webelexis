import { DataSource } from 'services/datasource';
import { BillingModel } from './../models/billings-model';
import { PLATFORM, bindable, autoinject, useView } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";
import { EventAggregator } from 'aurelia-event-aggregator';
import { LeistungsblockManager } from 'models/leistungsblock-model';

@autoinject
// @useView(PLATFORM.moduleName("./billing.pug"))
export class Billing {
  @bindable kons;
  billings: Array<BillingModel>
  private billingService
  billingdiv
  showmenu = false;
  contextmenu
  menuleft = 50;
  menutop = 60;
  currentItem: BillingModel
  sum: number

  constructor(private bm: BillingsManager, private lbm: LeistungsblockManager, private ds: DataSource, private ea: EventAggregator) {
    this.billingService = ds.getService('billing')
  }

  attached() {
    this.loadBillings()
    this.billingService.on('created', this.updateBillings)
  }

  detached() {
    this.billingService.off('created', this.updateBillings)
  }

  updateBillings = updated => {
    if (updated.behandlung == this.kons.id) {
      this.loadBillings()
    }
  }

  loadBillings() {
    this.bm.getBillings(this.kons).then(result => {
      this.billings = result.sort((a, b) => a.compare(b))
      this.recalc()
    })

  }

  recalc() {
    let sum = 0
    for (const billing of this.billings) {
      const b = billing.getBilling()
      const preis = parseFloat(b.vk_preis)
      const num = parseFloat(b.zahl)
      sum += preis * num
    }
    this.sum = sum / 100;
  }
  addBilling() {
    this.ea.publish("left_panel", "leistungen")
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
    if (data.startsWith('block')) {
      this.lbm.applyBlock(data.substring('block!'.length),this.kons).then(result=>{

      })
    } else {
      this.bm.getBillable(data).then(billable => {
        const existing = this.billings.find(elem => elem.isBillingOf(billable))
        if (existing) {
          this.bm.increaseCount(existing).then(b => {
            this.loadBillings()
          })
        } else {

          this.bm.createBilling(billable, this.kons, 1).then(billing => {
          })
        }
      })
    }
    return true
  }

  modifyNumber() {
    const item: BillingModel = this.currentItem
    this.showmenu = false;
    const nn = prompt("Neue Zahl", this.currentItem.getBilling().zahl)
    if (nn) {
      this.bm.setCount(item, nn).then(r => {
        this.loadBillings()
      })
    }
  }

  remove() {
    this.bm.removeBilling(this.currentItem).then(i => {
      this.loadBillings()
      this.showmenu = false
    })
  }

  removeAll() {
    this.bm.removeAllBillings(this.kons).then(i => {
      this.loadBillings()
      this.showmenu = false
    })
  }

  toggleMenu(item, index, event) {
    this.menutop = event.clientY;
    this.menuleft = event.clientX;
    this.showmenu = !this.showmenu
    this.currentItem = item
  }
}
