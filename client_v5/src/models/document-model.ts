import { ObjectManager } from './object-manager';
import type { ElexisType, DATE } from './elexistype';
import { currentUser } from '../services/store'

export interface DocumentType extends ElexisType {
  "Content-Type": Array<string>
  "Last-Modified": string // ISO-Date
  date: string // ISO-Date
  title: string
  concern: string  //lastname_firstname_birthdate (dd.mm.yyyy)
  lastname: string
  firstname: string
  birthdate: DATE
  loc: string   // location within lucinda's document base
  Lucinda_ImportedAt: string
}

export class DocumentManager extends ObjectManager {
  constructor() {
    super("lucinda")
  }


}
