/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";

export interface Selection{
  type: string
  item: any
}

@autoinject
export class Globals{
  SELECTION="itemSelected"
  loaded=false
  //terminDataService:DataService
  selected={
    user: undefined,
  }

  constructor(private ea:EventAggregator){
    this.ea.subscribe(this.SELECTION,(selection:Selection)=>{
      this.selected[selection.type]=selection.item
    })
  }



}
