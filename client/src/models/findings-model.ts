/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/


import { ElexisType } from "./elexistype";
import { autoinject, LogManager } from "aurelia-framework";
import { DataService, DataSource } from "../services/datasource";
import { WebelexisEvents } from '../webelexisevents'
import defs from '../user/finding-defs'
import * as _ from 'lodash'

const log = LogManager.getLogger("findings-model")
let definitions: any = {}

for (const def of <Array<FindingDef>>defs) {
  definitions[def.name] = def
}

/**
  * A finding definition is used to define, how to generate and display data for external measurements.
  * All findings tu use in the system must be defined in src/user/finding-defs.ts.
  */
 export type FindingDef = {
  // a unique name, e.g "circulation"
  name: string
  // a translatable title, e.g. "Kreislauf"
  title: string
  // list of elements, e.g. ["systolic:mmHg","diastolic:mmHg","Pulse:1/min"]
  elements: Array<{
    title:string,     // e.g. "systolisch"
    unit?: string,     // e.g. "mmHg"
    manual?: boolean,  // show in manual input box?
    chart?: "none"|"left"|"right"   // display in chart?
    color?: string,    // html-colordef
    range?: [number,number]  // acceptable range
  }>
  // a function to create a new entry from a string
  create?: (value: string | Array<string>) => Array<string>
  // a function to display an entry in verbose form
  verbose?: (row: Array<string | number>) => string
  // a function to display an entry in compact form
  compact?: (row: Array<string | number>) => string
}


/**
 * A finding as stored inm the database
 */
export interface FindingType extends ElexisType {
  patientid: string,
  name: string,            // e.g. 'physical'
  measurements: Array<     // e.g. [{ date: '22.8.2018', values: ['57','178','17.9']}]
  {
    date: Date,
    values: Array<string | number>
  }
  >
}

/**
 * FindingsManager is used to create, retrieve, change and update findingd
 */
@autoinject
export class FindingsManager {
  private service: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.service = ds.getService('findings')

  }

  /**
   * get the (user provided - see /src/user/finding-defs.ts) and system processed 
   * (see constructor) finding category definitions
   */
  getDefinitions() {
    return definitions
  }

  /**
   * Get Name and title of all defined finding categoeries
   */
  async getFindingNames() {
    return defs.map(e => [e.name, e.title])
  }

  /**
   * Get the findings of a given category for a given patient
   * @param name category to find
   * @param patid patient to match
   * @returns a Promise with a FindingsModel with the requested finding, or undefined if none found
   */
  async getFindings(name: string, patid: string): Promise<FindingsModel> {
    if (patid) {
      const fm = await this.service.find({ query: { name: name, patientid: patid } })
      if (fm.data && fm.data.length > 0) {
        log.debug("found existing " + JSON.stringify(fm.data[0]))
        return new FindingsModel(fm.data[0])
      }
    }
    return undefined
  }
  /**
   * Fetch or create a Finding with a given name for the given selected Patient.
   * If no such Finding is found, create a new one.
   * @param name Name of the Finding to fetch
   * @param patid: Patient to match or null for the currently selected patient
   * @returns the existing or newly created FindingModel of the specified type for the specified patient 
   */
  async fetch(name: string, patid): Promise<FindingsModel> {
    if (!patid) {
      let pat = this.we.getSelectedItem('patient')
      patid = pat ? pat.id : undefined
    }
    if (patid) {
      const fm = await this.service.find({ query: { name: name, patientid: patid } })
      if (fm.data && fm.data.length > 0) {
        log.debug("found existing " + JSON.stringify(fm.data[0]))
        return new FindingsModel(fm.data[0])
      } else {
        const type = definitions[name]
        if (!type) {
          throw 'no finding definition for ' + name + ' found!'
        }
        try {
          const newFinding = await this.service.create({
            patientid: patid,
            name: name,
            measurements: []
          })
          log.debug("created new finding " + newFinding.id)
          return new FindingsModel(newFinding)
        } catch (err) {
          log.error("could not create finding %s:" + err.message + err, name)
          throw ("server error")
        }
      }
    }
  }

  async saveFinding(f: FindingsModel) {
    try {
      let updated = await this.service.update(f.f.id, f.f)
      return updated
    } catch (err) {
      log.error("could not update finding %s: " + err.message, JSON.stringify(f.f))
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
    let finding = await this.fetch(name, patid)
    try {
      finding.addMeasurement(values)
      finding.f = await this.service.update(finding.f.id, finding.f)
      return finding
    } catch (err) {
      log.error("couldn't update " + JSON.stringify(finding.f) + " - " + err.message + err)
      throw ("server error")
    }
  }

  createFindingFromString(name,value){
      const actPat = this.we.getSelectedItem('patient')
      const actUser = this.we.getSelectedItem('usr')
      const item=definitions[name]
      const processed=item.create(value)
      this.addFinding(name,actPat.id, processed).then(added=>{
  
      })
      return processed;
  }
  /**
   * remove a measrument from a finding
   * @param id id of the finding
   * @param date date/time to remove
   */
  async removeFinding(id: string, date: Date) {
    try {
      const f: FindingType = await this.service.get(id)
      const finding = new FindingsModel(f)
      if (finding.removeMeasurement(date)) {
        let updated = await this.service.update(finding.f.id, finding.f)
      }
    } catch (err) {
      log.error("couldn't delete " + id + " - " + err.message)
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
      date: mdate || new Date(),
      values: processed
    })
  }
  removeMeasurement = (date: Date) => {
    const candidate = this.f.measurements.findIndex(e => e.date == date)
    if (candidate > -1) {
      this.f.measurements.splice(candidate, 1)
      return true
    }
    return false
  }
  getRowFor(date): Array<String | number> {
    return this.f.measurements.find(m => m.date == date).values
  }
}
