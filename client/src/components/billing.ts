/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable } from "aurelia-framework";
import { BillingsManager } from "models/billings-model";
import { EncounterType } from "models/encounter";
import { LeistungsblockManager } from "models/leistungsblock-model";
import { DataService, DataSource } from "services/datasource";
import { BillingType } from "../models/billings-model";
import { BillingModel } from "../models/billings-model";

@autoinject
export class Billing {
  @bindable
  public kons: EncounterType;
  protected billings: BillingModel[];
  protected clazz = "bg-light";
  protected sum: number;
  protected menuleft = 50;
  protected menutop = 60;
  protected showmenu = false;
  private billingService: DataService;
  // private billingdiv;
  // private contextmenu;
   private currentItem: BillingModel;

   constructor(
    private bm: BillingsManager,
    private lbm: LeistungsblockManager,
    private ds: DataSource,
    private ea: EventAggregator
  ) {
    this.billingService = ds.getService("billing");
  }

  public attached() {
    this.loadBillings();
    this.billingService.on("created", this.updateBillings);
  }

  public detached() {
    this.billingService.off("created", this.updateBillings);
  }

  public dragOver(event) {
    event.preventDefault();
    this.clazz = "bg-warning";
    return true;
  }

  public dragleave(event) {
    this.clazz = "bg-light";
    return true;
  }
  /**
   *  a billable was dropped -> bill it
   */
  public dragDrop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    if (data.startsWith("block")) {
      this.lbm
        .applyBlock(data.substring("block!".length), this.kons, this.billings)
        .then(block => {
          this.loadBillings();
        });
    } else {
      this.bm.getBillable(data).then(billable => {
        this.bm
          .createBilling(billable, this.kons, 1, this.billings)
          .then(billing => {
            this.loadBillings();
          })
          .catch(err => {
            alert("could not create Billing " + err);
          });
      });
    }
    this.clazz = "bg-light";
    return true;
  }

  protected updateBillings = (updated: BillingType) => {
    if (updated.behandlung == this.kons.id) {
      this.loadBillings();
    }
  };

  protected loadBillings() {
    this.bm.getBillings(this.kons).then(result => {
      this.billings = result.sort((a, b) => a.compare(b));
      this.recalc();
    });
  }

  protected recalc() {
    let sum = 0;
    for (const billing of this.billings) {
      const b = billing.getBilling();
      const preis = parseFloat(b.vk_preis);
      const num = parseFloat(b.zahl);
      sum += preis * num;
    }
    this.sum = sum / 100;
  }

  /**
   * If the user click on the amount field -> show billings view
   */
  protected billingsView() {
    this.ea.publish("left_panel", "leistungen");
  }

  private modifyNumber() {
    const item: BillingModel = this.currentItem;
    this.showmenu = false;
    const nn = prompt("Neue Zahl", this.currentItem.getBilling().zahl);
    if (nn) {
      this.bm.setCount(item, nn).then(r => {
        this.loadBillings();
      });
    }
  }

  private remove() {
    this.bm.removeBilling(this.currentItem).then(i => {
      this.loadBillings();
      this.showmenu = false;
    });
  }

  private removeAll() {
    this.bm.removeAllBillings(this.kons).then(i => {
      this.loadBillings();
      this.showmenu = false;
    });
  }

  private toggleMenu(item, index, event) {
    this.menutop = event.clientY;
    this.menuleft = event.clientX;
    this.showmenu = !this.showmenu;
    this.currentItem = item;
  }
}
