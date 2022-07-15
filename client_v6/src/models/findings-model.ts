/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/


import type { ElexisType } from "./elexistype";
import { ObjectManager } from './object-manager'
import defs from '../user/finding-defs'
import util from "../services/util"

const definitions: any = {}

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
  expanded?: boolean       // display hint
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

  getDefinition(f: FindingType) {
    return definitions[f.name]
  }

  /**
   * Get Name and title of all defined finding categories
*/
  getFindingNames() {
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
  async getFinding(name: string, patid: string, bCreateIfMissing: boolean): Promise<FindingType> {
    if (name && patid) {
      const fm = await this.dataService.find({ query: { name: name, patientid: patid } })
      let result:FindingType
      if (fm.data && fm.data.length > 0) {
        result= fm.data[0]
      } else {
        if (bCreateIfMissing) {
          const type = definitions[name]
          if (!type) {
            throw new Error('no finding definition for ' + name + ' found!')
          }
          try {
            result = await this.dataService.create({
              patientid: patid,
              name: name,
              measurements: []
            })
          } catch (err) {
            throw new Error("server error " + err)
          }
        } else {
          throw new Error("Finding not found " + name)
        }
      }
      result.measurements.sort((a,b)=>{return a.datetime.localeCompare(b.datetime)})
      return result
    }else{
      throw new Error("Bad parameters for getFinding")
    }
  }

  async saveFinding(f: FindingType): Promise<FindingType> {
    try {
      let updated = await this.dataService.update(f.id, f)
      return updated
    } catch (err) {
      throw ("server error " + err)
    }
  }

  /**
   * Add measurements to a finding and save the modification to the database
   * @param name name of the finding
   * @param patid patient to match
   * @param values an arra with strings or numbers
   * @returns an updated FindingModel
   */
  async addMeasurement(f: FindingType, values: string[], mdate: string): Promise<FindingType> {
    const def = this.getDefinition(f)
    const processed = def.create ? def.create(values) : values
    f.measurements.push({
      datetime: util.normalize(mdate, util.ELEXISDATETIME),
      values: processed
    })
    f.measurements.sort((a,b)=>{return a.datetime.localeCompare(b.datetime)})
    try {
      const updated = await this.dataService.update(f.id, f)
      return updated
    } catch (err) {
      throw ("server error " + err)
    }
  }


  /**
   * Add a measurement from a string as defined in the 'cretae' attribute of the
   * finding definition
   * @param name name of the finding category
   * @param string-formed value to add (e.g. 120/80)
   * @returns
   */
  async createMeasurementFromString(patientid, name, value): Promise<FindingType> {
    const item = definitions[name]
    const processed = item.create(value)
    const f = await this.getFinding(name, patientid, true)
    const added = await this.addMeasurement(f, processed, util.DateToElexisDateTime(new Date()))
    return added;
  }
  /**
   * remove a measrument from a finding and save the modification to the database
   * @param id id of the finding
   * @param date date/time to remove
   */
  async removeMeasurement(f: FindingType, datetime: string): Promise<FindingType> {
    const candidate = f.measurements.findIndex(e => e.datetime === datetime)
    if (candidate > -1) {
      f.measurements.splice(candidate, 1)
      try {
        let updated = await this.dataService.update(f.id, f)
        return updated
      } catch (err) {
        throw ("server error " + err)
      }
    } else {
      return f
    }
  }

  getName = (f: FindingType) => f.name
  getTitle = (f: FindingType) => {
    const def = this.getDefinition(f)
    return def?.title
  }
  getElements = (f: FindingType) => {
    const def = this.getDefinition(f)
    return def?.elements
  }

  getRowFor(f: FindingType, datetime: string): Array<String | number> {
    return f.measurements.find(m => m.datetime === datetime).values
  }
}


