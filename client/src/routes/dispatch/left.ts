/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
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
  protected tooliconwidth=defaults.tooliconwidth
  protected tooliconheight=defaults.tooliconheight
  protected active=v.patientenliste
  protected parent
  protected buttons
  protected linked:boolean = false
  public static message="left_panel"
  protected leftpanelstyle=`position:absolute;left:${defaults.buttonbarwidth}px;width:${defaults.leftpanelwidth}px;`
  private views=[v.patientenliste,v.artikelliste,v.dokumentliste,v.briefe,v.messwerte,v.leistungen]

  constructor(private ea:EventAggregator,private sm:StickerManager){
    this.ea.subscribe(LeftPanel.message,view=>{
      this.switchTo(v[view])
    })
  }

  public attached(){
    const bwidth=this.buttons.offsetWidth
    const twidth=this.parent.offsetWidth
    return this.sm.loadStickers().then(st=>{
      // console.log(st)
    })
  }
  public switchTo(view){
    this.active=view
    if(this.linked && view.linksTo){
      this.ea.publish(RightPanel.message,view.linksTo)
    }
  }

  public link(){
    this.linked=!this.linked
  }
}
