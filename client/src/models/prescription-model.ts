import { autoinject } from 'aurelia-framework'
import { DataSource } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import { Z_FIXED } from 'zlib';

const FIXMEDI="0"
const RESERVE="1"
const RECIPE="2"
const SELFDISPENSED="3"
const DONTKNOW="4"
const SYMPTOMATIC="5" 

export interface PrescriptionType extends ElexisType {
  Dosis: string
  Bemerkung: string
  patientid: UUID
  REZEPTID: UUID
  DateFrom: string  // YYYYMMDDHHmmss
  DateUntil: string
  ANZAHL: string
  Artikel: UUID | ElexisType
  prescType: string
  sortOrder: string
  prescDate: string // YYYYMMDD
  prescriptor: UUID
}
@autoinject
export class PrescriptionManager {
  private prescriptionLoader
  private artikelLoader
  constructor(private ds: DataSource) {
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

  async setMode(prescriptionID:UUID, mode:string){
    const prescription:PrescriptionType=await this.prescriptionLoader.get(prescriptionID)
    switch(mode){
      case "fixmedi": prescription.prescType=FIXMEDI; break;
      case "reservemedi": prescription.prescType=RESERVE; break;
      case "symptommedi": prescription.prescType=SYMPTOMATIC; break;
      default: prescription.prescType=SYMPTOMATIC
    }
    const updated:PrescriptionType=await this.prescriptionLoader.update(prescriptionID,prescription)
    console.log(prescription.prescType+" -> "+updated.prescType)
    return updated
  }

  getLabel(presc: PrescriptionType) {
    return presc.Artikel["DSCR"]
  }
}
