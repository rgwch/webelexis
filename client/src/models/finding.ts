
import { ElexisType } from "./elexistype";
import { autoinject } from "aurelia-framework";
import { DataService, DataSource } from "../services/datasource";
import { resolve } from "path";

export interface FindingType extends ElexisType{
  name:string,            // e.g. 'physical'
  elements:Array<string>  // e.g. ['weight', 'height', 'bmi']
  measurements:Array<     // e.g. [{ date: '22.8.2018', values: ['57','178','17.9']}]
  {
    date: Date,
    values: Array<string>
  }
  >
}

@autoinject
export class Findings{
  private service:DataService

  constructor(private ds:DataSource){
    this.service=ds.getService('findings')
  }

  fetch(name:string):Promise<Finding>{
    return this.service.find({query:{name:name}})
      .then(f=>{
        return new Finding(f.data[0])
      },err=>{
        return new Finding({name:name,elements:[],measurements:[]})
      })
  }
}

export class Finding{
  f:FindingType
  constructor(obj:FindingType){
    this.f=obj
  }
  getName=()=>this.f.name
  getElements=()=>this.f.elements
  getMeasurements=()=>this.f.measurements

  getRowFor(date):Array<String>{
    return []
  }
}
