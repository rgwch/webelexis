/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { EncounterType } from './encounter';
import { DataSource, DataService } from './../services/datasource';
import { ElexisType } from './elexistype';
import { autoinject } from 'aurelia-framework';

export interface BillingType extends ElexisType{
  code?: string
  behandlung: string
  leistg_txt: string
  leistg_code: string
  klasse: string
  zahl: string
  vk_preis: string
}

@autoinject
export class BillingsManager{
  billingService:DataService

  constructor(private ds:DataSource){
    this.billingService=this.ds.getService('billing')
  }

  async getBillings(kons:EncounterType){
    const ret= await this.billingService.find({query:{behandlung:kons.id}})
    return ret.data.map(b=>new BillingModel(b))
  }
}

export class BillingModel{
  constructor(private obj:BillingType){}
  getLabel(){
    const code=this.obj.code || this.obj.leistg_code.split(/\s*-\s*/)[0]
    return this.obj.zahl+" "+code+" "+this.obj.leistg_txt
  }

}
