import { ElexisType, UUID } from "./elexistype";
import { PatientType } from "./patient";
import { KontaktType } from "./kontakt";
import { autoinject } from "aurelia-framework";
import { DateTime } from '../services/datetime'
import hash from 'string-hash'
import { WebelexisEvents } from "webelexisevents";
import { ObjectManager } from "./object-manager";

/**
 * A Document is an (arbitrary) entity to store and retrieve by name and keywords.
 */
export interface DocType extends ElexisType {
  date: string
  concern?: PatientType | UUID
  origin?: KontaktType | UUID
  filename?: string
  subject?: string    // title or indication of the document
  payload: string
  category?: string
}

@autoinject
export class DocManager extends ObjectManager{

  constructor(private we: WebelexisEvents, private dt: DateTime) {
    super('lucinda')
  }
  public store(doc: DocType): Promise<any> {
    if (!doc.date) {
      doc.date = this.dt.DateToElexisDate(new Date())
    }
    if (!doc.filename) {
      doc.filename = hash(doc.payload)
    }
    doc.payload = btoa(doc.payload)
    return this.dataService.create(doc)
  }
}
