import { autoinject } from 'aurelia-framework'
import { DataSource } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';

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
    this.artikelLoader = ds.getService('article')
  }

  fetchCurrent(patientid: UUID) {
    return this.prescriptionLoader.find({ query: { current: patientid } }).then(result => {
      return result.data
    })
  }

  async getLabel(presc: PrescriptionType) {
    if (!(presc.Artikel instanceof Object)) {
      presc.Artikel = await this.artikelLoader.get(presc.Artikel)
    }
    return presc.Artikel["DSCR"]

  }
}
