/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { bindable, PLATFORM, useView} from "aurelia-framework";

/**
 * A generic search box. bind "searchtext" to the placeholder and "result" to the value.
 */
@useView(PLATFORM.moduleName('./searchfield.pug'))
export class Searchfield{

  @bindable searchtext
  val
  @bindable result

  doSearch(){
    this.result=this.val
  }
  keyPressed(ev){
    if(ev.keyCode===13){
      this.doSearch()
      //ev.preventDefault();
    }else{
      return true;
    }
  }
}
