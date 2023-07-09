import { ObjectManager } from './object-manager';
import type { ElexisType, DATE } from './elexistype';
import { currentUser } from '../services/store'
import type { PatientType } from './patient-model';
import { PatientManager } from './patient-model';
import type { QueryResult } from './query-result';
const pm = new PatientManager()
export interface DocumentType extends ElexisType {
  "Content-Type": Array<string>
  "Last-Modified": string // ISO-Date
  date: string // ISO-Date
  title: string
  concern: string  //lastname_firstname_birthdate (dd.mm.yyyy)
  lastname: string
  firstname: string
  birthdate: DATE
  loc?: string   // location within lucinda's document base
  Lucinda_ImportedAt?: string
  type?: "blob" | "result" | "letter",
  payload?: any
  filename?: string
}

export class DocumentManager extends ObjectManager {

  constructor() {
    super("lucinda")
  }

  public async getForPatient(pat: PatientType): Promise<Array<DocumentType>> {
    const concern = pm.createConcern(pat)
    const result: QueryResult = await this.dataService.find({ query: { concern } })
    return result.data
  }

  public async createForPatient(pat: PatientType, title: string, data: any, contentType: string = "Application/octet-stream"): Promise<ElexisType> {
    const doc: DocumentType = {
      "Content-Type": [contentType],
      "Last-Modified": new Date().toISOString(),
      payload: data,
      filename: title,
      title,
      date: new Date().toISOString(),
      concern: pm.createConcern(pat),
      lastname: pat.bezeichnung1,
      firstname: pat.bezeichnung2,
      birthdate: pat.geburtsdatum
    }
    const result = await this.save(doc)
    return result;
  }

}
