import { KontaktType } from '../models/kontakt';
import { DataSource } from '../services/datasource';
import { DataService } from 'services/datasource';
import { DialogController } from 'aurelia-dialog';
import { autoinject, observable, valueConverter } from "aurelia-framework";
import {BindingSignaler} from 'aurelia-templating-resources'

import './select-kontakt.scss'

@autoinject
export class SelectKontakt{
  @observable value;
  found=[]
  selection:KontaktType=null

  private kontaktService:DataService;

  constructor(private dc:DialogController, private ds:DataSource, private signaler: BindingSignaler){
    this.kontaktService=ds.getService("kontakt")
  }

  valueChanged(newValue,oldValue){
    this.kontaktService.find({query:{$find: this.value}}).then(result=>{
      this.found=result.data
    })
  }

  makeLabel(k:KontaktType){
    return k.bezeichnung1+" "+k.bezeichnung2
  }

  select(k){
    this.selection=k
    this.signaler.signal('selected')
  }
}

/*
  set item class according to selection Status (needs signal 'selected')
*/
@valueConverter('kontaktSelected')
export class KontaktSelected{
  toView(item,sel){
    if(sel && (sel.id == item.id)){
      return "highlight"
    }else{
      return "listitem"
    }
  }
}
