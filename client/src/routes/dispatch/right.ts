/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';
import { State } from '../../state'
import {connectTo} from 'aurelia-store'
import {pluck} from 'rxjs/operators'
import {WebelexisEvents} from '../../webelexisevents'
import defaults from '../../user/uidefaults'

@connectTo(store=>store.state.pipe(<any>pluck("leftPanel")))
@autoinject
export class RightPanel{
  tooliconwidth=defaults.tooliconwidth
  tooliconheight=defaults.tooliconheight
  views=[v.stammdaten,v.konsultationen,v.dokumente,v.artikeldetail,v.labor,v.agendagross,v.medikation]
  active=v.stammdaten
  expanded=false
  parent
  rightpanelstyle=`position:absolute;left:${defaults.buttonbarwidth+defaults.leftpanelwidth}px;right:${defaults.buttonbarwidth}px;`
  subscription: Subscription
  static message="right_panel"

  constructor(private ea:EventAggregator, private we:WebelexisEvents){
    this.subscription=this.ea.subscribe(RightPanel.message,(view=>{
      const newView=v[view]
      if(newView){
        this.switchTo(newView)
      }
    }))
  }

  stateChanged(showNow,showBefore){
    if(showNow){
      this.rightpanelstyle="position:absolute;left:440px;right:85px;"
    }else{
      this.rightpanelstyle="position:absolute;left:5px;right:85px;"
    }
  }
  expand(mode){
    this.expanded=mode
  }

  activate(params) {
    if (params && params.sub) {
      const actview = this.views.find(v => v.text.toLowerCase() == params.sub)
      this.active = actview
    }else{
      this.active=v.stammdaten
    }
  }


  toggleLeftPane(){
    this.we.toggleLeftPanel()
    /*
    if(context.showLeftPane){
      this.style="position:absolute;left:395px;right:85px;"
    }else{
      this.style="position:absolute;left:5px;right:85px;"
    }
  */
  }
  calcwidth(){
    const w=this.parent.getBoundingClientRect().width-this.tooliconwidth
    const st= `width:${w}px`
    return st
  }
  switchTo(view){
    this.active=view
  }
}
