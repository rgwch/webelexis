
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2022 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/
import type { ElexisType, UUID } from "./elexistype"
import { ObjectManager } from './object-manager';
import { getService, IService } from '../services/io'
import { DateTime } from "luxon";
import type { PatientType } from './patient-model'
import type { KontaktType } from './kontakt-model'
import defs from '../services/util'

export enum Modalities {
  FIXMEDI = "0",
  RESERVE = "1",
  RECIPE = "2",
  SELFDISPENSED = "3",
  DONTKNOW = "4",
  SYMPTOMATIC = "5"
}

/**
 * An Elexis "Rezept"
 */
export interface RezeptType extends ElexisType {
  patientid: UUID
  mandantid: UUID
  datum: string // 8 ELEXISDATE
  rptext: string
  rpzusatz: string
  briefid: UUID
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
  dscr: string
}
/**
 * An Elexis "Prescription"
 */
export interface PrescriptionType extends ElexisType {
  dosis?: string
  bemerkung?: string
  patientid: UUID
  rezeptid?: UUID
  _Rezept?: RezeptType
  datefrom: string  // YYYYMMDDHHmmss - ELEXISDATETIME
  dateuntil?: string // ELEXISDATETIME
  anzahl?: string
  artikel?: UUID
  _Artikel?: ArticleType
  artikelid?: UUID
  presctype?: string
  sortorder?: string
  prescdate: string // YYYYMMDD - ELEXISDATE
  prescriptor: UUID
}

export type MEDICATIONDEF = {
  fix?: Array<PrescriptionType>
  reserve?: Array<PrescriptionType>
  symptom?: Array<PrescriptionType>
  rezeptdefs?: Array<any>
}
export class PrescriptionManager extends ObjectManager {
  // private prescriptionLoader
  private metaLoader
  private rezepteLoader
  private articleLoader

  constructor() {
    super("prescriptions")
    this.metaLoader = getService('meta-article')
    this.rezepteLoader = getService('rezepte')
    this.articleLoader = getService('article')
  }

  public async findArticle(term: string): Promise<Array<ArticleType>> {
    const found = await this.articleLoader.find({ query: { dscr: {$like: `%${term}%`} } })
    return found.data
  }
  /**
   * Fetch medication of current patient
   * @param patientid
   */
  public async fetchCurrent(patientid: UUID): Promise<MEDICATIONDEF> {
    const result = await super.find({ query: { current: patientid } })
    const ret: MEDICATIONDEF = {
      fix: [],
      reserve: [],
      symptom: [],
      rezeptdefs: []
    }
    const rps = new Map()
    for (const prescription of result.data) {
      if (!prescription.presctype) {
        prescription.presctype = "-1"
      }
      switch (prescription.presctype) {
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

  }
  /**
   * create a new Prescription based on an existing prescription with a new Modality
   * @param presc
   * @param modality
   */
  public async cloneAs(presc: PrescriptionType, modality: string) {
    const ret = Object.assign({}, presc, { presctype: modality })
    ret.datefrom = DateTime.now().minus({ 'minutes': 10 }).toFormat(defs.ELEXISDATETIME)
    ret.prescdate = DateTime.now().minus({ 'minutes': 10 }).toFormat(defs.ELEXISDATE)
    delete ret.id
    const created = await this.dataService.create(ret)
    created._Artikel = ret._Artikel
    created._Rezept = ret._Rezept
    return created
  }

  /**
   * Create a new "rezept"
   */
  public createRezept(patient: PatientType, mandant: KontaktType) {
    const rp = {
      patientid: patient.id,
      mandantid: mandant.id,
      datum: DateTime.now().toFormat(defs.ELEXISDATE)
    }

    return this.rezepteLoader.create(rp).then(ret => {
      return ret;
    }).catch(err => {
      console.log(err)
    })
  }

  public saveRezept(rezept: RezeptType) {
    return this.rezepteLoader.update(rezept.id, rezept).then(updated => {
      return updated
    })
  }
  /**
   * Fetch a prescription from a "scoped id"
   * @param data a 'scoped id': <datatype::id>
   *
   */
  public async fetchScoped(data: string, patient: PatientType, prescriptor: KontaktType) {
    const [datatype, dataid] = data.split("::")
    let prescription: PrescriptionType
    if (datatype == "prescription") {
      prescription = await this.dataService.get(dataid)
    } else if (datatype == "article") {
      const article = await this.metaLoader.get(dataid)
      prescription = await this.createFromArticle(patient, prescriptor, article)
    }
    return prescription
  }

  /**
   * Set the mode of a Prescription (fix, reserve)
   * @param data scoped id: <datatype::id>
   * @param mode fixmedi|reservemedi|rezept|symptommedi
   */
  public async setMode(data: string, params?: any): Promise<PrescriptionType> {
    const now = DateTime.now().minus({ 'minutes': 10 })
    const nowFormatted = now.toFormat(defs.ELEXISDATETIME)
    let prescription = await this.fetchScoped(data, params.patient, params.prescriptor)

    switch (params.mode) {
      case "fixmedi":
        prescription.presctype = Modalities.FIXMEDI;
        prescription.dateuntil = null
        break;
      case "reservemedi":
        prescription.presctype = Modalities.RESERVE;
        prescription.dateuntil = null
        break;
      case "rezept":
        const copy = Object.assign({}, prescription)
        delete copy.id
        prescription = await this.dataService.create(copy)
        prescription.presctype = Modalities.RECIPE
        prescription.dateuntil = null
        prescription.rezeptid = params.rezeptid
        prescription.artikel = copy.artikel
        break;
      case "symptommedi": prescription.presctype = Modalities.SYMPTOMATIC;
        prescription.dateuntil = nowFormatted
        break;
      default: prescription.presctype = Modalities.SYMPTOMATIC
    }
    prescription.datefrom = nowFormatted
    prescription.prescdate = DateTime.now().toFormat(defs.ELEXISDATE) //this.dt.DateToElexisDate(new Date())
    const updated: PrescriptionType = await this.dataService.update(prescription.id, prescription)
    // console.log(prescriptionpresctype+" -> "+updated.presctype)
    return prescription
  }

  public getLabel(presc: PrescriptionType): string {
    const from = defs.ElexisDateToLocalDate(presc.datefrom)
    const label = presc.artikel ? presc.artikel["DSCR"] || "--" : "?"
    let ret = `${label} (${from}`

    if (presc.dateuntil && presc.dateuntil.substr(0, 8) !== presc.datefrom.substr(0, 8)) {
      const until = defs.ElexisDateToLocalDate(presc.dateuntil)
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
  public save(obj: PrescriptionType): Promise<PrescriptionType> {
    return this.dataService.update(obj.id, obj).then((updated: PrescriptionType) => {
      return updated
    }).catch(err => {
      console.log(err)
    })
  }

  /**
   * Create a Prescription from an Article
   * @param article
   */
  public async createFromArticle(patient: PatientType, prescriptor: KontaktType, article: ArticleType): Promise<PrescriptionType> {
    const presc: PrescriptionType = {
      patientid: patient.id,
      datefrom: DateTime.now().minus({ 'minutes': 10 }).toFormat(defs.ELEXISDATETIME),
      artikel: "ch.artikelstamm.elexis.common.ArtikelstammItem::" + article.id,
      prescdate: DateTime.now().toFormat(defs.ELEXISDATE),// this.dt.DateToElexisDate(new Date())
      prescriptor: prescriptor.id
    }
    const created = await this.dataService.create(presc)
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
      const removed = await this.dataService.remove(dataid)
      return removed
    }
    return undefined
  }
}
