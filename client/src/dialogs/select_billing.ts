import { DataSource, DataService } from './../services/datasource';
import { DialogController } from 'aurelia-dialog';
import { autoinject, useView, PLATFORM } from "aurelia-framework";

@autoinject
export class SelectBilling{
  tarmedService:DataService

  constructor(private dc:DialogController, private ds:DataSource){
    this.tarmedService=ds.getService("tarmed")
  }

}
