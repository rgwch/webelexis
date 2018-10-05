/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator } from 'aurelia-event-aggregator';
import { RightPanel } from './right';
import { StickerManager } from '../../models/stickers.model';


@autoinject
export class LeftPanel{
  tooliconwidth=40
  tooliconheight=40
  views=[v.patientenliste,v.artikelliste,v.dokumentliste]
  active=v.patientenliste
  parent
  buttons
  connected:boolean = false
  static message="left_panel"
  imgdata

  constructor(private ea:EventAggregator,private sm:StickerManager){
    this.ea.subscribe(LeftPanel.message,view=>{
      this.switchTo(v[view])
    })
  }

  attached(){
    const bwidth=this.buttons.offsetWidth
    const twidth=this.parent.offsetWidth
    return this.sm.loadStickers().then(st=>{
      // console.log(st)
      let sticker=st.Hausarztmodell
      this.imgdata=sticker.imagedata
    })
  }
  switchTo(view){
    this.active=view
    if(this.connected && view.linksTo){
      this.ea.publish(RightPanel.message,view.linksTo)
    }
  }

  connect(){
    this.connected=!this.connected
  }
}
