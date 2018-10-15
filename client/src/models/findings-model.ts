/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/


import { ElexisType } from "./elexistype";
import { autoinject } from "aurelia-framework";
import { DataService, DataSource } from "../services/datasource";
import { WebelexisEvents } from '../webelexisevents'
import findingdefs from '../user/findings'

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

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.service = ds.getService('findings')
  }

  /**
   * Fetch a Finding with a given name for the currently selected Patient.
   * If no such Finding is found, create a new one.
   * @param name Name of the Finding to fetch
   */
  async fetch(name: string): Promise<FindingsModel> {
    const pat = this.we.getSelectedItem('patient')
    if (pat) {
      const fm = await this.service.find({ query: { name: name, patientid: pat.id } })
      if (fm.data && fm.data.length > 0) {
        return new FindingsModel(fm)
      } else {
        const type = findingdefs[name]
        const newFinding= await this.service.create({
          patientid: pat.id,
          name: name,
          elements: type.elements,
          measurements: []
        })
        return new FindingsModel(newFinding)
      }
    }
  }

  async addFinding(name: string, values: Array<string | number>) {
    let finding = await this.fetch(name)
    finding.addMeasurement(values)
    finding.f=await this.service.update(finding.f.id,finding.f)
    return finding
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
  getRowFor(date): Array<String | number> {
    return this.f.measurements.find(m => m.date == date).values
  }
}
