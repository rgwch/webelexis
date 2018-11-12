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
import defaults from '../../user/uidefaults'

@autoinject
export class LeftPanel{
  tooliconwidth=40
  tooliconheight=40
  views=[v.patientenliste,v.artikelliste,v.dokumentliste,v.messwerte,v.leistungen]
  active=v.patientenliste
  parent
  buttons
  connected:boolean = false
  static message="left_panel"
  leftpanelstyle=`position:absolute;left:${defaults.buttonbarwidth}px;width:${defaults.leftpanelwidth}px;`

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
