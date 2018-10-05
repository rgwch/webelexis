/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import v from './views'
import { autoinject } from 'aurelia-framework';
import { EventAggregator, Subscription } from 'aurelia-event-aggregator';

@autoinject
export class RightPanel{
  tooliconwidth=40
  tooliconheight=40
  views=[v.stammdaten,v.konsultationen,v.dokumente,v.artikeldetail,v.agendagross]
  active=v.stammdaten
  expanded=false
  parent
  style="position:absolute;left:395px;right:85px;"
  subscription: Subscription
  static message="right_panel"

  constructor(private ea:EventAggregator){
    this.subscription=this.ea.subscribe(RightPanel.message,(view=>{
      const newView=v[view]
      if(newView){
        this.switchTo(newView)
      }
    }))
  }

  expand(mode){
    this.expanded=mode
  }

  activate(params) {
    if (params.sub) {
      const actview = this.views.find(v => v.text.toLowerCase() == params.sub)
      this.active = actview
    }
  }


  toggleLeftPane(context){
    context.toggleLeftPane()
    if(context.showLeftPane){
      this.style="position:absolute;left:395px;right:85px;"
    }else{
      this.style="position:absolute;left:5px;right:85px;"
    }

  }
  calcwidth(){
    const w=this.parent.getBoundingClientRect().width-this.tooliconwidth
    const st= `width:${w}px`
    console.log(st);
    return st
  }
  switchTo(view){
    this.active=view
  }
}
