import { Subscription } from 'aurelia-event-aggregator';
import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework'
import { DataSource } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import { DateTime as edt } from '../services/datetime'
import * as moment from 'moment'
const FIXMEDI = "0"
const RESERVE = "1"
const RECIPE = "2"
const SELFDISPENSED = "3"
const DONTKNOW = "4"
const SYMPTOMATIC = "5"
//const ELEXISDATETIME = "yyyyLLddHHmmss"
const ELEXISDATETIME = "YYYYMMDDHHmmss"
export interface PrescriptionType extends ElexisType {
  Dosis?: string
  Bemerkung?: string
  patientid: UUID
  REZEPTID?: UUID
  DateFrom: string  // YYYYMMDDHHmmss
  DateUntil?: string
  ANZAHL?: string
  Artikel: UUID | ElexisType
  prescType?: string
  sortOrder?: string
  prescDate: string // YYYYMMDD
  prescriptor: UUID
}
@autoinject
export class PrescriptionManager {
  private prescriptionLoader
  private artikelLoader

  constructor(private ds: DataSource, private we: WebelexisEvents, private dt: edt) {
    this.prescriptionLoader = ds.getService('prescriptions')
    this.artikelLoader = ds.getService('meta-article')
  }

  fetchCurrent(patientid: UUID) {
    return this.prescriptionLoader.find({ query: { current: patientid } }).then(result => {
      const ret = {
        fix: [],
        reserve: [],
        symptom: [],
        rezepte: null
      }
      const rps = new Map()
      for (const art of result.data) {
        switch (art.prescType) {
          case FIXMEDI: ret.fix.push(art); break;
          case RESERVE: ret.reserve.push(art); break;
          case SYMPTOMATIC: ret.symptom.push(art); break;
          // don't know what to do with 2-4
          default: ret.symptom.push(art);
        }
        if (art.REZEPTID) {
          const rezept = art.REZEPTID
          if (rezept.id) {
            let entry = rps.get(rezept.id)
            if (!entry) {
              entry = {
                date: rezept.datum,
                articles: []
              }
              rps.set(rezept.id, entry)
            }
            entry.articles.push(art)
          }
        }
      }
      ret.rezepte=rps.entries
      return ret
    })
  }

  async fetch(data: string) {
    const [datatype, dataid] = data.split("::")
    let prescription: PrescriptionType
    if (datatype == "prescription") {
      prescription = await this.prescriptionLoader.get(dataid)
    } else if (datatype == "article") {
      prescription = await this.createFromArticle(dataid)
    }
    return prescription
  }

  async setMode(data: string, mode: string): Promise<PrescriptionType> {
    const [datatype, dataid] = data.split("::")
    const now = moment().subtract(10, 'minutes')
    const nowFormatted = now.format(ELEXISDATETIME)
    let prescription: PrescriptionType
    if (datatype == "prescription") {
      prescription = await this.prescriptionLoader.get(dataid)
    } else if (datatype == "article") {
      prescription = await this.createFromArticle(dataid)
    }
    switch (mode) {
      case "fixmedi": prescription.prescType = FIXMEDI;
        prescription.DateFrom = nowFormatted
        prescription.DateUntil = null
        break;
      case "reservemedi": prescription.prescType = RESERVE;
        prescription.DateFrom = nowFormatted
        prescription.DateUntil = null
        break;

      case "symptommedi": prescription.prescType = SYMPTOMATIC;
        prescription.DateUntil = nowFormatted
        break;
      default: prescription.prescType = SYMPTOMATIC
    }
    prescription.prescDate = this.dt.DateToElexisDate(new Date())
    const updated: PrescriptionType = await this.prescriptionLoader.update(prescription.id, prescription)
    // console.log(prescription.prescType+" -> "+updated.prescType)
    return updated
  }

  getLabel(presc: PrescriptionType): string {
    const from = this.dt.ElexisDateTimeToLocalDate(presc.DateFrom)
    let ret = `${presc.Artikel["DSCR"]} (${from}`
    if (presc.DateUntil && presc.DateUntil.substr(0, 8) !== presc.DateFrom.substr(0, 8)) {
      const until = this.dt.ElexisDateTimeToLocalDate(presc.DateUntil)
      ret += " - " + until + ")"
    } else {
      ret += ")"
    }
    return ret
  }

  async createFromArticle(artid: UUID): Promise<PrescriptionType> {
    const presc: PrescriptionType = {
      patientid: this.we.getSelectedItem('patient').id,
      DateFrom: moment().subtract(10, 'minutes').format(ELEXISDATETIME),
      Artikel: "ch.artikelstamm.elexix.common.ArtikelstammItem::" + artid,
      prescDate: this.dt.DateToElexisDate(new Date()),
      prescriptor: this.we.getSelectedItem('usr').id
    }
    const created = await this.prescriptionLoader.create(presc)
    console.log("created from article:" + JSON.stringify(created))
    return created
  }
  async delete(data: string) {
    const [datatype, dataid] = data.split("::")
    if (datatype == "prescription") {
      const removed = await this.prescriptionLoader.remove(dataid)
      return removed
    }
    return undefined
  }
}
