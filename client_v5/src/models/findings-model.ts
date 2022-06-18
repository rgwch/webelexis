/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/


import type { ElexisType } from "./elexistype";
import { ObjectManager } from './object-manager'
import type { UserType } from "./user-model";
import { currentPatient, currentUser } from "../services/store";
import defs from '../user/finding-defs'
import util from "../services/util"

const definitions: any = {}

let patient
let user
currentPatient.subscribe(p => { patient = p })
currentUser.subscribe(u => user = u)

for (const def of defs as FindingDef[]) {
  definitions[def.name] = def
}

/**
 * A finding definition is used to define, how to generate and display data for external measurements.
 * All findings to use in the system must be defined in src/user/finding-defs.ts.
 */
export interface FindingDef {
  // a unique name, e.g "circulation"
  name: string
  // a translatable title, e.g. "Kreislauf"
  title: string
  // list of elements, e.g. ["systolic:mmHg","diastolic:mmHg","Pulse:1/min"]
  elements: Array<{
    title: string,     // e.g. "systolisch"
    unit?: string,     // e.g. "mmHg"
    manual?: boolean,  // show in manual input box?
    chart?: "none" | "left" | "right"   // display in chart?
    color?: string,    // html-colordef
    range?: [number, number]  // acceptable range
  }>
  // a function to create a new entry from a string
  create?: (value: string | string[]) => string[]
  // a function to display an entry in verbose form
  verbose?: (row: Array<string | number>) => string
  // a function to display an entry in compact form
  compact?: (row: Array<string | number>) => string
}


/**
 * A finding as stored in the database
 */
export interface FindingType extends ElexisType {
  patientid: string,
  name: string,            // e.g. 'physical'
  title: string,          // translatable title,e.g. "Gewicht"
  measurements: Array<     // e.g. [{ date: '22.8.2018', values: ['57','178','17.9']}]
    {
      datetime: string,
      values: Array<string | number>,
      selected?: boolean
    }
  >
}

/**
 * FindingsManager is used to create, retrieve, change and update findingd
 */
export class FindingsManager extends ObjectManager {

  constructor() {
    super('findings')

  }

  /**
   * get the (user provided - see /src/user/finding-defs.ts) finding category definitions
   */
  getDefinitions() {
    return definitions
  }

  /**
   * Get Name and title of all defined finding categories
*/
  async getFindingNames() {
    return defs.map(e => [e.name, e.title])
  }


  /**
   * Fetch or create a Finding with a given name for the given selected Patient.
   * If no such Finding is found, create a new one.
   * @param name Name of the Finding to fetch
   * @param patid: Patient to match
   * @param bCreateIfMissing:if true: Cretae that Finding, if it doesn't exist
   * @returns A promise with the existing or newly created FindingModel of the specified type for the specified patient 
   */
  async getFinding(name: string, patid: string, bCreateIfMissing: boolean): Promise<FindingsModel> {
    if (name && patid) {
      const fm = await this.dataService.find({ query: { name: name, patientid: patid} })
      if (fm.data && fm.data.length > 0) {
        return new FindingsModel(fm.data[0])
      } else {
        if (bCreateIfMissing) {
          const type = definitions[name]
          if (!type) {
            throw new Error('no finding definition for ' + name + ' found!')
          }
          try {
            const newFinding = await this.dataService.create({
              patientid: patid,
              name: name,
              measurements: []
            })
            return new FindingsModel(newFinding)
          } catch (err) {
            throw ("server error")
          }
        } else {
          throw new Error("Finding not found " + name)
        }
      }
    }
  }

  async saveFinding(f: FindingsModel) {
    try {
      let updated = await this.dataService.update(f.f.id, f.f)
      return updated
    } catch (err) {
      throw ("server error")
    }
  }

  /**
   * Add measurements to a finding
   * @param name name of the finding
   * @param patid patient to match
   * @param values an arra with strings or numbers 
   * @returns an updated FindingModel
   */
  async addFinding(name: string, patid: string, values: string[]) {
    let finding = await this.getFinding(name, patid, true)
    try {
      finding.addMeasurement(values)
      finding.f = await this.dataService.update(finding.f.id, finding.f)
      return finding
    } catch (err) {
      throw ("server error")
    }
  }

  /**
   * Add a measurement from a string as defined in the 'cretae' attribute of the
   * finding definition
   * @param name name of the finding category
   * @param string-formed value to add (e.g. 120/80)
   * @returns 
   */
  createFindingFromString(name, value) {
    const actPat = patient
    const actUser: UserType = user
    const item = definitions[name]
    const processed = item.create(value)
    this.addFinding(name, actPat.id, processed).then(added => {

    })
    return processed;
  }
  /**
   * remove a measrument from a finding
   * @param id id of the finding
   * @param date date/time to remove
   */
  async removeFinding(id: string, datetime: string) {
    try {
      const f: FindingType = await this.dataService.get(id)
      const finding = new FindingsModel(f)
      if (finding.removeMeasurement(datetime)) {
        let updated = await this.dataService.update(finding.f.id, finding.f)
      }
    } catch (err) {
      throw ("server error")
    }
  }
}

/**
 * FindingsModel is a wrapper around a FindingDef/FindingType to allow some operations
 * Note: FindingModel will neither fetch nor save its contents to the DataService. It
 * only manipulates in-clientside-memory.
 */
export class FindingsModel {
  f: FindingType
  def: FindingDef
  constructor(obj: FindingType) {
    this.f = obj
    this.def = definitions[this.f.name]
  }
  getName = () => this.f.name
  getTitle = () => this.def.title
  getElements = () => this.def.elements
  getMeasurements = () => this.f.measurements
  addMeasurement = (m: Array<string>, mdate: Date = undefined) => {
    const processed = this.def.create ? this.def.create(m) : m
    this.f.measurements.push({
      datetime: util.DateToElexisDateTime(mdate || new Date()),
      values: processed
    })
  }
  removeMeasurement = (datetime: string) => {
    const candidate = this.f.measurements.findIndex(e => e.datetime === datetime)
    if (candidate > -1) {
      this.f.measurements.splice(candidate, 1)
      return true
    }
    return false
  }
  getRowFor(datetime:string): Array<String | number> {
    return this.f.measurements.find(m => m.datetime === datetime).values
  }
}
