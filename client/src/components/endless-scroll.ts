/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, autoinject } from "aurelia-framework";

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
