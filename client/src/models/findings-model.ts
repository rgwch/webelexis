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
import { FindingDef } from "./finding-def";

const log = LogManager.getLogger("findings-model")
/**
 * Generic findings (blood pressure, weight and so on). 
 * Configuration in src/user/findings
 */
export interface FindingType extends ElexisType {
  patientid: string,
  name: string,            // e.g. 'physical'
  elements: Array<string>  // e.g. ['weight', 'height', 'bmi']
  measurements: Array<     // e.g. [{ date: '22.8.2018', values: ['57','178','17.9']}]
  {
    date: Date,
    values: Array<string | number>
  }
  >
}

@autoinject
export class FindingsManager {
  private service: DataService
  private definitions={}

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.service = ds.getService('findings')
    for(const def of defs){
      this.definitions[def.name]=def
    }
  }

  getDefinitions(){
    return this.definitions
  }

  async getFindingNames() {
    return defs.map(e=>[e.name,e.title])
  }

  async getFindings(name: string, patid: string): Promise<FindingsModel> {
    if (patid) {
      const fm = await this.service.find({ query: { name: name, patientid: patid } })
      if (fm.data && fm.data.length > 0) {
        log.debug("found existing " + JSON.stringify(fm.data[0]))
        return new FindingsModel(fm.data[0])
      } else {
        return undefined
      }
    }
  }
  /**
   * Fetch a Finding with a given name for the currently selected Patient.
   * If no such Finding is found, create a new one.
   * @param name Name of the Finding to fetch
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
        const type = this.definitions[name]
        if (!type) {
          throw 'no finding definition for ' + name + ' found!'
        }
        try {
          const newFinding = await this.service.create({
            patientid: patid,
            name: name,
            elements: type.elements,
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
  async addFinding(name: string, patid: string, values: string[])
  async addFinding(name: string, patid: string, values: number[])
  async addFinding(name: string, patid: string, values: Array<string | number>) {
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

  async removeFinding(id: string, date: Date) {
      try {
        const f:FindingType = await this.service.get(id)
        const finding=new FindingsModel(f)
        if (finding.removeMeasurement(date)) {
          let updated = await this.service.update(finding.f.id, finding.f)
        }
      } catch (err) {
        log.error("couldn't delete " + id + " - " + err.message)
        throw ("server error")
      }
  }
}

export class FindingsModel {
  f: FindingType
  constructor(obj: FindingType) {
    this.f = obj
  }
  getName = () => this.f.name
  getElements = () => this.f.elements
  getMeasurements = () => this.f.measurements
  addMeasurement = (m: Array<string | number>) => {
    this.f.measurements.push({
      date: new Date(),
      values: m
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
