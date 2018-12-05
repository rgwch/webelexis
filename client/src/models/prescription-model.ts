import { autoinject } from 'aurelia-framework'
import { DataSource } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import { Z_FIXED } from 'zlib';

enum PrescType {
  Fixmedikation,
  Reserve,
  Recipe,
  SelfDispensed,
  Symptomatic = 5

}

export interface PrescriptionType extends ElexisType {
  Dosis: string
  Bemerkung: string
  patientid: UUID
  REZEPTID: UUID
  DateFrom: string  // YYYYMMDDHHmmss
  DateUntil: string
  ANZAHL: string
  Artikel: UUID | ElexisType
  prescType: PrescType
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
          case 0: ret.fix.push(art); break;
          case 1: ret.reserve.push(art); break;
          case 5: ret.symptom.push(art);break;
          // don't know what to do with 2-4
          default: ret.symptom.push(art); 
        }
      }
      return ret
    })
  }

  getLabel(presc: PrescriptionType) {
    return presc.Artikel["DSCR"]
  }
}
