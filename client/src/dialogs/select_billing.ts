import { DataSource, DataService } from './../services/datasource';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView, PLATFORM, observable } from "aurelia-framework";
import { EncounterType } from 'models/encounter';

@autoinject
export class SelectBilling {
  tarmedService: DataService
  articleService: DataService
  @observable position: string
  encounter: EncounterType
  billables=[]
  a={
    b:"c",
    [this.position]:"d"
  }
  sql=(fld)=>{return {query: {[fld]: {$like: this.position+"%"}}}}

  activate(kons){
    this.encounter=kons
  }
  positionChanged(newValue, oldValue) {
    this.billables=[]
    const tsql=this.sql("tx255")
    
    this.tarmedService.find({query: {$find: this.position,$enctr: this.encounter}}).then(result=>{
      if(result.data && result.data.length){
        this.billables=this.billables.concat(result.data)
      }
    })
    this.articleService.find(this.sql("DSCR")).then(result=>{
      if(result.data && result.data.length){
        this.billables=this.billables.concat(result.data)
      }
    })
  }
  constructor(private dc: DialogController, private ds: DataSource) {
    this.tarmedService = ds.getService("tarmed")
    this.articleService = ds.getService("article")
  }

  makeLabel(elem){
    if(elem.tx255){
      return elem.tx255
    }else{
      return elem.DSCR
    }
  }

}
