/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';
import { DataSource, DataService } from 'services/datasource';

@autoinject
export class ShowTemplates{
  briefeService:DataService
  constructor(private dc:DialogController,ds:DataSource){
    this.briefeService=ds.getService('briefe')
  }
  templates

  attached(){
    this.briefeService.find({query:{typ: "Vorlagen", Betreff: {$like: "%_webelexis"}}}).then(result=>{
      this.templates=result.data
    })
  }

} 
