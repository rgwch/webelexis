
import { ElexisType } from "./elexistype";
import { autoinject } from "aurelia-framework";
import { DataService, DataSource } from "../services/datasource";
import { WebelexisEvents } from '../webelexisevents'

export interface FindingType extends ElexisType {
  patientid: string,
  name: string,            // e.g. 'physical'
  elements: Array<string>  // e.g. ['weight', 'height', 'bmi']
  measurements: Array<     // e.g. [{ date: '22.8.2018', values: ['57','178','17.9']}]
  {
    date: Date,
    values: Array<string>
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
        return new FindingsModel(
          {
            patientid: pat.id,
            name: name,
            elements: [],
            measurements: []
          })
      }
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

  getRowFor(date): Array<String> {
    return []
  }
}
