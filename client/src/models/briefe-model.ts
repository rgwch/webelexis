import { PatientType } from './patient';
import { KontaktType } from './kontakt';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/


import { WebelexisEvents } from './../webelexisevents';
import { DataService, DataSource } from 'services/datasource';
import { autoinject } from 'aurelia-framework';
import { ElexisType, UUID } from './elexistype';
import { DateTime } from 'services/datetime';

export interface BriefType extends ElexisType {
  Betreff: string
  Datum: string
  modifiziert?: string
  gedruckt?: string
  absenderid?: UUID
  destid?: UUID
  behandlungsid?: UUID
  patientid?: UUID
  _Patient?: PatientType
  typ: "Vorlagen" | "Allg." | "AUF-Zeugnis" | "Rezept" | "Labor" | "Bestellung" | "Rechnung"
  MimeType: string
  Path?: string
  note?: string
}

@autoinject
export class BriefManager {
  briefService: DataService
  kontaktService: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents, private dt: DateTime) {
    this.briefService = ds.getService('briefe')
    this.kontaktService = ds.getService('kontakt')
  }

  /**
   * Generate a letter (which means: merge a template with a number of field definitions and system constants)
   * @param brief 
   * @param template 
   * @param fields 
   */
  async generate(brief: BriefType, template: string, fields?: Array<{ field: string, replace: string }>) {
    const tmpls = await this.briefService.find({ query: { Betreff: template + "_webelexis", typ: "Vorlagen" } })
    if (tmpls.data.length > 0) {
      const tmpl = await this.briefService.get(tmpls.data[0].id)
      const compiled = await this.replaceFields(tmpl.contents, brief, fields)
      return compiled
    } else {
      throw new Error("Template " + template + " not found")
    }
  }
  /**
   * Fetch a related kontakt from thebid in the field denoted by 'flat'. 
   * To reduce number of net accesses, once a kontakt is fetched, we store it in the field denoted by
   * 'fold'. So, on as subseqent call, we can just return the value of tmpl[fold].
   */
  findKontakt = async (tmpl, flat, fold): Promise<KontaktType> => {
    if (tmpl[fold]) {
      return tmpl[fold]
    } else if (tmpl[flat]) {
      tmpl[fold] = await this.kontaktService.get(tmpl[flat])
      return tmpl[fold]
    } else {
      console.log("not found %s",tmpl)
      return undefined
    }
  }
  /**
   * Replace fields in the template with data from the 'brief' and fields from an array.
   * First scan the template for fieldnames enclosed in [brackets] matching the names in the fields-Array
   * and replace them with the values in the field array.
   * Second, scan for fields of the form [datatype.attribute] and replace them with the currently active 
   * instance of the datatype and the named attribute therof.
   * @param template An html template with some fields to replace in the form [fieldname] or [datatype.attribute]
   * @param brief 
   * @param fields 
   */
  async replaceFields(template: string, brief: BriefType, fields?: Array<{ field: string, replace: string }>) {
    const fieldmatcher = /\[\w+\.\w+\]/ig
    for (const f of fields) {
      if (!f.replace) {
        f.replace = ""
      }
      template = template.replace("[" + f.field + "]", f.replace)

    }
    let destinator
    let concerning
    try {
      destinator = await this.findKontakt(brief, "destid", "_Dest")
      concerning = await this.findKontakt(brief, "patientid", "_Patient")
    } catch (err) {
      console.log(err)
    }
    const getEntity=(desc: string): ElexisType=> {
      let entity: ElexisType = undefined
      switch (desc.toLowerCase()) {
        case "adressat":
        case "addressee": entity = destinator; break;
        case "patient": 
        case "concern": entity = concerning; break;
        // case "datum": entity = this.dt.DateObjectToLocalDate(new Date())
        default:
          entity = this.we.getSelectedItem(desc)
      }
      return entity
    }
    const compiled = template.replace(fieldmatcher, field => {
      const full = field.substring(1, field.length - 1)
      const parts = full.split(":")
      let value = parts[0]
      if (parts.length == 3) { // [patient:mw:er/sie], [adressat:mwn:er/sie/unpers]
        const entity = getEntity(parts[0])
        const v1 = parts[2].split("/")
      }
      const [element, attribute] = value.split(".")
      let replacement: string = ""
      if (element == "datum") {
        replacement = this.dt.DateObjectToLocalDate(new Date())
      } else {
        const entity = getEntity(element)
        if (entity) {
          replacement = entity[attribute]
        }
      }
      if (replacement) {
        if (replacement.match(/[0-9]{8,8}/)) {
          replacement = this.dt.ElexisDateToLocalDate(replacement)
        }
        return replacement
      } else {
        return field
      }
    })
    return compiled
  }

  processField(k: KontaktType) { }
}
