import {bindable, Container, computedFrom, autoinject} from "aurelia-framework";
import {SlotView} from "./slot-view";
import {Slot} from "../models/slot";
import {AgendaRoute} from "../routes/agenda/index";

export class SlotMenu{
  @bindable host:AgendaRoute
  @bindable slotobj:Slot
  private links=[{
    label:"shorten",
    action:  this.shorten
  },{
    label:"lengthen",
    action:this.lengthen
  }]

  private shorten(){
    this.host.shorten(this.slotobj)
  }

  private lengthen(){
    this.host.lengthen(this.slotobj)
  }

  public doAction(link) {
    link.action.call(this);
  }

}