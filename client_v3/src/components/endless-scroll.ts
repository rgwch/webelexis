/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, autoinject } from "aurelia-framework";

/**
 * A component to scroll 'forever'. New items are loaded
 * from a datasource in the background as required. Clients can either bind
 * a 'loadMore' function or listen to the 'reload' event and deliver the next
 * chunk of data accordingly.
 */
@autoinject
export class EndlessScroll{
  @bindable limit=90
  @bindable loadMore=(percent)=>{
    const event=new CustomEvent('reload',{
      detail: percent,
      bubbles: true
    })
    this.element.dispatchEvent(event)
  }
  private scrollTop=0

  constructor(private element:Element){}

  scroll(){
    const percent=this.scrollTop*100/this.element.children[0].scrollHeight
    if(percent>this.limit){
      // console.log(percent)
      this.loadMore(percent)
    }
  }
}
