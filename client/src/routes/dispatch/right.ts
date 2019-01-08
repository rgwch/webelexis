/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
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
  protected tooliconwidth=defaults.tooliconwidth
  protected tooliconheight=defaults.tooliconheight
  private views=[v.stammdaten,v.konsultationen,v.dokumente,v.artikeldetail,v.labor,v.agendagross,v.medikation]
  protected active=v.stammdaten
  protected expanded=false
  protected parent
  protected rightpanelstyle=`position:absolute;left:${defaults.buttonbarwidth+defaults.leftpanelwidth}px;right:${defaults.buttonbarwidth}px;`
  private subscription: Subscription
  public static message="right_panel"

  constructor(private ea:EventAggregator, private we:WebelexisEvents){
    this.subscription=this.ea.subscribe(RightPanel.message,(view=>{
      const newView=v[view]
      if(newView){
        this.switchTo(newView)
      }
    }))
  }

  public stateChanged(showNow,showBefore){
    if(showNow){
      this.rightpanelstyle="position:absolute;left:440px;right:85px;"
    }else{
      this.rightpanelstyle="position:absolute;left:5px;right:85px;"
    }
  }
  public expand(mode){
    this.expanded=mode
  }

  public activate(params /*, routeConfig */) {
    //routeConfig.navModel.setTitle("test")
    if (params && params.sub) {
      const actview = this.views.find(v => v.text.toLowerCase() == params.sub)
      this.active = actview
    }else{
      this.active=v.stammdaten
    }
  }


  public toggleLeftPane(){
    this.we.toggleLeftPanel()
  }
  protected calcwidth(){
    const w=this.parent.getBoundingClientRect().width-this.tooliconwidth
    const st= `width:${w}px`
    return st
  }
  private switchTo(view){
    this.active=view
  }
}
