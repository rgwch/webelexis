import { EncounterType } from './encounter';
import { DataSource, DataService } from './../services/datasource';
import { ElexisType } from './elexistype';
import { autoinject } from 'aurelia-framework';
export type BillingDef={

}

export interface BillingType extends ElexisType{

}

@autoinject
export class BillingsManager{
  billingService:DataService

  constructor(private ds:DataSource){
    this.billingService=this.ds.getService('billing')
  }

  async getBillings(kons:EncounterType){
    const ret= await this.billingService.find({query:{behandlung:kons.id}})
    return ret
  }
}
