import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework'
import { DataSource } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import {DateTime} from '../services/datetime'

const FIXMEDI="0"
const RESERVE="1"
const RECIPE="2"
const SELFDISPENSED="3"
const DONTKNOW="4"
const SYMPTOMATIC="5" 

export interface PrescriptionType extends ElexisType {
  Dosis?: string
  Bemerkung?: string
  patientid: UUID
  REZEPTID?: UUID
  DateFrom: string  // YYYYMMDDHHmmss
  DateUntil?: string
  ANZAHL?: string
  Artikel: UUID | ElexisType
  prescType?: string
  sortOrder?: string
  prescDate: string // YYYYMMDD
  prescriptor: UUID
}
@autoinject
export class PrescriptionManager {
  private prescriptionLoader
  private artikelLoader
  
  constructor(private ds: DataSource, private we:WebelexisEvents, private dt:DateTime) {
    this.prescriptionLoader = ds.getService('prescriptions')
    this.artikelLoader = ds.getService('meta-article')
  }

  fetchCurrent(patientid: UUID) {
    return this.prescriptionLoader.find({ query: { current: patientid } }).then(result => {
      const ret={
        fix:[],
        reserve:[],
        symptom:[]
      }
      for(const art of result.data){
        switch(art.prescType){
          case FIXMEDI: ret.fix.push(art); break;
          case RESERVE: ret.reserve.push(art); break;
          case SYMPTOMATIC: ret.symptom.push(art);break;
          // don't know what to do with 2-4
          default: ret.symptom.push(art); 
        }
      }
      return ret
    })
  }

  async setMode(data:string, mode:string){
    const [datatype,dataid]=data.split("::")
    let prescription:PrescriptionType
    if(datatype=="prescription"){
      prescription=await this.prescriptionLoader.get(dataid)
    }else if(datatype=="article"){
      prescription=await this.createFromArticle(dataid)
    }
    switch(mode){
      case "fixmedi": prescription.prescType=FIXMEDI; break;
      case "reservemedi": prescription.prescType=RESERVE; break;
      case "symptommedi": prescription.prescType=SYMPTOMATIC; break;
      default: prescription.prescType=SYMPTOMATIC
    }
    const updated:PrescriptionType=await this.prescriptionLoader.update(prescription.id,prescription)
    // console.log(prescription.prescType+" -> "+updated.prescType)
    return updated
  }

  getLabel(presc: PrescriptionType) {
    const from=this.dt.ElexisDateTimeToLocalDate(presc.DateFrom)
    let ret=`${presc.Artikel["DSCR"]} (${from}`
    if(presc.DateUntil){
      const until=this.dt.ElexisDateTimeToLocalDate(presc.DateUntil)
      ret+=until+")"
    }else{
      ret+=")"
    }
    return ret
  }
  
  async createFromArticle(artid:UUID){
    const presc:PrescriptionType={
      patientid: this.we.getSelectedItem('patient').id,
      DateFrom: this.dt.DateToElexisDateTime(new Date()),
      Artikel: "ch.artikelstamm.elexix.common.ArtikelstammItem::"+artid,
      prescDate: this.dt.DateToElexisDate(new Date()),
      prescriptor: this.we.getSelectedItem('usr').id
    }
    const created=await this.prescriptionLoader.create(presc)
    return created
  }
}
