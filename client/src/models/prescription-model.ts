/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework'
import { DataSource, DataService } from 'services/datasource';
import { ElexisType, UUID } from './elexistype';
import { DateTime as edt } from '../services/datetime'
import { RpDef } from './prescription-model';
import * as moment from 'moment'

export class Modalities {
  public static FIXMEDI = "0"
  public static RESERVE = "1"
  public static RECIPE = "2"
  public static SELFDISPENSED = "3"
  public static DONTKNOW = "4"
  public static SYMPTOMATIC = "5"
}

const ELEXISDATETIME = "YYYYMMDDHHmmss"
const ELEXISDATE = "YYYYMMDD"

/**
 * An Elexis "Rezept"
 */
export interface RezeptType extends ElexisType {
  patientid: UUID
  mandantid: UUID
  datum: string // 8
  rptext: string
  RpZusatz: string
  BriefID: UUID
  prescriptions: PrescriptionType[]
}
/**
 * Internal representation of a "Rezept"
 */
export interface RpDef {
  rezept: RezeptType,
  prescriptions: PrescriptionType[]
}

/**
 * An Elexis "Artikel"
 */
export interface ArticleType extends ElexisType {
  DSCR: string
}
/**
 * An Elexis "Prescription"
 */
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
  private rezepteLoader: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents, private dt: edt) {
    this.prescriptionLoader = ds.getService('prescriptions')
    this.artikelLoader = ds.getService('meta-article')
    this.rezepteLoader = ds.getService('rezepte')
  }

  /**
   * Fetch medication of current patient
   * @param patientid 
   */
  public fetchCurrent(patientid: UUID) {
    return this.prescriptionLoader.find({ query: { current: patientid } }).then(result => {
      const ret = {
        fix: [],
        reserve: [],
        symptom: [],
        rezeptdefs: []
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
          let rpd: RpDef = rps.get(rezept.id)
          if (!rpd) {
            rpd = {
              rezept: rezept,
              prescriptions: []
            }
            rps.set(rezept.id, rpd)
          }
          rpd.prescriptions.push(prescription)
        }
      }
      ret.rezeptdefs = Array.from(rps).map(r => r[1])
      return ret
    })
  }

  /**
   * create a new Prescription based on an existing prescription with a new Modality
   * @param presc 
   * @param modality 
   */
  public async cloneAs(presc: PrescriptionType, modality: string) {
    const ret = Object.assign({}, presc, { prescType: modality })
    ret.DateFrom = moment().subtract(10, 'minutes').format(ELEXISDATETIME)
    ret.prescDate = moment().subtract(10, 'minutes').format(ELEXISDATE)
    delete ret.id
    const created = await this.prescriptionLoader.create(ret)
    created._Artikel = ret._Artikel
    created._Rezept = ret._Rezept
    return created
  }

  /**
   * Create a new "rezept"
   */
  public createRezept() {
    const rp = {
      patientid: this.we.getSelectedItem('patient').id,
      mandantid: this.we.getSelectedItem('usr').id,
      datum: moment().format(ELEXISDATE)
    }

    return this.rezepteLoader.create(rp).then(ret => {
      return ret;
    }).catch(err => {
      console.log(err)
    })
  }

  public saveRezept(rezept:RezeptType){
    return this.rezepteLoader.update(rezept.id,rezept).then(updated=>{
      return updated
    })
  }
  /**
   * Fetch a prescription from a "scoped id" 
   * @param data a 'scoped id': <datatype::id> 
   * 
   */
  public async fetch(data: string) {
    const [datatype, dataid] = data.split("::")
    let prescription: PrescriptionType
    if (datatype == "prescription") {
      prescription = await this.prescriptionLoader.get(dataid)
    } else if (datatype == "article") {
      const article = await this.artikelLoader.get(dataid)
      prescription = await this.createFromArticle(article)
    }
    return prescription
  }

  /**
   * Set the mode of a Prescription (fix, reserve)
   * @param data scoped id: <datatype::id>
   * @param mode fixmedi|reservemedi|rezept|symptommedi
   */
  public async setMode(data: string, params?: any): Promise<PrescriptionType> {
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

  public getLabel(presc: PrescriptionType): string {
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

  /**
   * Save a modified prescription
   * @param obj 
   */
  public save(obj: PrescriptionType) : Promise<PrescriptionType>{
    return this.prescriptionLoader.update(obj.id, obj).then((updated: PrescriptionType) => {
      return updated
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * Create a Prrscription from an Article
   * @param article 
   */
  public async createFromArticle(article: ArticleType): Promise<PrescriptionType> {
    const presc: PrescriptionType = {
      patientid: this.we.getSelectedItem('patient').id,
      DateFrom: moment().subtract(10, 'minutes').format(ELEXISDATETIME),
      Artikel: "ch.artikelstamm.elexis.common.ArtikelstammItem::" + article.id,
      prescDate: this.dt.DateToElexisDate(new Date()),
      prescriptor: this.we.getSelectedItem('usr').id
    }
    const created = await this.prescriptionLoader.create(presc)
    console.log("created from article:" + JSON.stringify(created))
    created._Artikel = article
    return created
  }

  /**
   * Delete a prescription
   * @param data a scoped id
   */
  public async delete(data: string): Promise<PrescriptionType> {
    const [datatype, dataid] = data.split("::")
    if (datatype == "prescription") {
      const removed = await this.prescriptionLoader.remove(dataid)
      return removed
    }
    return undefined
  }
}
