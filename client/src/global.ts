/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import { autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { DataService, DataSource } from "./services/datasource";

export interface Selection{
  type: string
  item: any
}

@autoinject
export class Globals{
  SELECTION="itemSelected"
  agendaTypColors={}
  agendaStateColors={}
  loaded=false
  //terminDataService:DataService
  selected={
    user: undefined,
  }

  constructor(private ea:EventAggregator,private ds:DataSource){
    this.loadDefaultsFor("Gerry")
    this.ea.subscribe(this.SELECTION,(selection:Selection)=>{
      this.selected[selection.type]=selection.item
    })
    //this.terminDataService=this.ds.getService('termin')
  }

  async loadDefaultsFor(user:string){
    const ts=this.ds.getService('termin')
    this.agendaTypColors=await ts.get("typecolors",{query: {resource: user}})
    this.agendaStateColors=await ts.get("statecolors", {query:{resource: user}})
    this.loaded=true
    this.selected.user=user
  }

  getAgendaTypColorFor(termintyp:string){
    let tc=this.agendaTypColors[termintyp] || "aaaaaa"
    return "#"+tc
  }
  getAgendaStateColorFor(terminstatus:string){
    let ts=this.agendaStateColors[terminstatus] || "bbbbbb"
    return "#"+ts
  }

  async getStates(){
    return this.agendaStateColors;
  }

}
