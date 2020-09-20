import { bindable } from 'aurelia-framework';
import { autoinject } from 'aurelia-dependency-injection';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogController } from 'aurelia-dialog'

 @autoinject
 export class TextInput{
  heading: string=""
  text: string=""

  constructor(private dc: DialogController){}

  activate(m){
    this.heading=m.caption
  }
 }
