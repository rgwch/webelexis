import { Prescriptions } from './../views/prescriptions-view';
import { Subscription } from 'aurelia-event-aggregator';
import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework'
import { DataSource, DataService } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import { DateTime as edt } from '../services/datetime'
import * as moment from 'moment'

export class Modalities {
  static FIXMEDI = "0"
  static RESERVE = "1"
  static RECIPE = "2"
  static SELFDISPENSED = "3"
  static DONTKNOW = "4"
  static SYMPTOMATIC = "5"
}

//const ELEXISDATETIME = "yyyyLLddHHmmss"
const ELEXISDATETIME = "YYYYMMDDHHmmss"
const ELEXISDATE = "YYYYMMDD"

export interface RezeptType extends ElexisType {
  patientid: UUID
  mandantid: UUID
  datum: string // 8
  rptext: string
  RpZusatz: string
  BriefID: UUID
  prescriptions: Array<PrescriptionType>
}

export interface ArticleType extends ElexisType {
  DSCR: string
}
export interface PrescriptionType extends ElexisType {
  Dosis?: string
  Bemerkung?: string
  patientid: UUID
  REZEPTID?: UUID
  _Rezept?: ElexisType
  DateFrom: string  // YYYYMMDDHHmmss
  DateUntil?: string
  ANZAHL?: string
  Artikel?: UUID
  _Artikel?: ArticleType
  artikelid?: UUID
  prescType?: string
  sortOrder?: string
  prescDate: string // YYYYMMDD
  prescriptor: UUID
}


@autoinject
export class PrescriptionManager {
  private prescriptionLoader: DataService
  private artikelLoader: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents, private dt: edt) {
    this.prescriptionLoader = ds.getService('prescriptions')
    this.artikelLoader = ds.getService('meta-article')
  }

  /**
   * Fetch medication of current patient
   * @param patientid 
   */
  fetchCurrent(patientid: UUID) {
    return this.prescriptionLoader.find({ query: { current: patientid } }).then(result => {
      const ret = {
        fix: [],
        reserve: [],
        symptom: [],
        rezepte: []
      }
      const rps = new Map()
      for (const prescription of result.data) {
        if (!prescription.prescType) {
          prescription.prescType = "-1"
        }
        switch (prescription.prescType) {
          case Modalities.FIXMEDI: ret.fix.push(prescription); break;
          case Modalities.RESERVE: ret.reserve.push(prescription); break;
          case Modalities.SYMPTOMATIC: ret.symptom.push(prescription); break;
          // don't know what to do with 2-4
          default: ret.symptom.push(prescription);
        }
        if (prescription._Rezept) {
          const rezept = prescription._Rezept
          let rp = rps.get(rezept.id)
          if (!rp) {
            rp = rezept
            rp.prescriptions = []
            rps.set(rezept.id, rp)
          }
          rp.prescriptions.push(prescription)
        }
      }
      ret.rezepte = Array.from(rps).map(r => r[1])
      return ret
    })
  }

  /**
   * create a new Prescription based on an existing prescription with a new Modality
   * @param presc 
   * @param modality 
   */
  async cloneAs(presc: PrescriptionType, modality: string) {
    const ret = Object.assign({}, presc, { prescType: modality })
    ret.DateFrom = moment().subtract(10, 'minutes').format(ELEXISDATETIME)
    ret.prescDate = ret.DateFrom
    delete ret.id
    const created = await this.prescriptionLoader.create(ret)
    created._Artikel = ret._Artikel
    created._Rezept = ret._Rezept
    return created
  }

  /**
   * Create a new "rezept"
   */
  createRezept() {
    const rpService = this.ds.getService('rezepte')
    const rp = {
      patientid: this.we.getSelectedItem('patient').id,
      mandantid: this.we.getSelectedItem('usr').id,
      datum: moment().format(ELEXISDATE)
    }

    return rpService.create(rp).then(ret => {
      return ret;
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * Fetch a prescription from an "extended id" 
   * @param data an 'extended id': <datatype::id> 
   * 
   */
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

  /**
   * Set the mode of a Prescription (fix, reserve)
   * @param data extended id: <datatype::id>
   * @param mode fixmedi|reservemedi|rezept|symptommedi
   */
  async setMode(data: string, params?: any): Promise<PrescriptionType> {
    const now = moment().subtract(10, 'minutes')
    const nowFormatted = now.format(ELEXISDATETIME)
    let prescription = await this.fetch(data)

    switch (params.mode) {
      case "fixmedi":
        prescription.prescType = Modalities.FIXMEDI;
        prescription.DateUntil = null
        break;
      case "reservemedi":
        prescription.prescType = Modalities.RESERVE;
        prescription.DateUntil = null
        break;
      case "rezept":
        const copy = Object.assign({}, prescription)
        delete copy.id
        prescription = await this.prescriptionLoader.create(copy)
        prescription.prescType = Modalities.RECIPE
        prescription.DateUntil = null
        prescription.REZEPTID = params.rezeptid
        prescription.Artikel = copy.Artikel
        break;
      case "symptommedi": prescription.prescType = Modalities.SYMPTOMATIC;
        prescription.DateUntil = nowFormatted
        break;
      default: prescription.prescType = Modalities.SYMPTOMATIC
    }
    prescription.DateFrom = nowFormatted
    prescription.prescDate = this.dt.DateToElexisDate(new Date())
    const updated: PrescriptionType = await this.prescriptionLoader.update(prescription.id, prescription)
    // console.log(prescription.prescType+" -> "+updated.prescType)
    return prescription
  }

  getLabel(presc: PrescriptionType): string {
    const from = this.dt.ElexisDateTimeToLocalDate(presc.DateFrom)
    const label = presc.Artikel ? presc.Artikel["DSCR"] || "--" : "?"
    let ret = `${label} (${from}`

    if (presc.DateUntil && presc.DateUntil.substr(0, 8) !== presc.DateFrom.substr(0, 8)) {
      const until = this.dt.ElexisDateTimeToLocalDate(presc.DateUntil)
      ret += " - " + until + ")"
    } else {
      ret += ")"
    }
    return ret
  }

  async save(obj: PrescriptionType) {
    return await this.prescriptionLoader.update(obj.id, obj)
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
