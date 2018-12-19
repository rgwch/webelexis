import { ElexisType, UUID } from "./elexistype";
import { Patient } from "./patient";
import { Kontakt } from "./kontakt";
import { WebelexisEvents } from "../../test/spec/dummyevents";
import { DataSource } from "services/datasource";
import { autoinject } from "aurelia-framework";
import { DateTime } from '../services/datetime'
import hash from 'string-hash'

/**
 * A Document is an (arbitrary) entity to store and retrieve by name and keywords. 
 */
export interface DocType extends ElexisType {
  date: string
  concern?: Patient | UUID
  origin?: Kontakt | UUID
  filename?: string
  subject?: string    // title or indication of the document
  payload: string
  category?: string
}

@autoinject
export class DocManager {
  docService

  constructor(private we: WebelexisEvents, private ds: DataSource, private dt: DateTime) {
    this.docService = this.ds.getService('lucinda')
  }
  store(doc: DocType) : Promise<any>{
    if (!doc.date) {
      doc.date = this.dt.DateToElexisDate(new Date())
    }
    if (!doc.filename) {
      doc.filename = hash(doc.payload)
    }
    doc.payload = btoa(doc.payload)
    return this.docService.create(doc)
  }
}
