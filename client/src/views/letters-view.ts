/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, } from "aurelia-framework";
import { DialogService } from "aurelia-dialog";
import { ShowTemplates } from './../dialogs/show-templates';

@autoinject
export class Letters{
  constructor(private dlgs:DialogService){}
  searchexpr=""
  template

  showTemplates(){
    this.dlgs.open({viewModel: ShowTemplates,model: this.template}).whenClosed(result=>{
      if(!result.wasCancelled){
        this.template=result.output
      }
    })
  }
} 
