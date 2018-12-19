/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

 
import { WebelexisEvents } from './../webelexisevents';
import { DataService, DataSource } from 'services/datasource';
import { autoinject } from 'aurelia-framework';
import { ElexisType } from './elexistype';
import { DateTime } from 'services/datetime';

export interface BriefType extends ElexisType {
  Betreff: string
  Datum: string
  modifiziert?: string
  gedruckt?: string
  absenderid?: string
  destid?: string
  behandlungsid?: string
  patientid?: string
  typ: "Vorlagen" | "Allg." | "AUF-Zeugnis" | "Rezept" | "Labor" | "Bestellung" | "Rechnung"
  MimeType: string
  Path?: string
  note?: string
}

@autoinject
export class BriefManager {
  briefService: DataService

  constructor(private ds: DataSource, private we: WebelexisEvents, private dt: DateTime) {
    this.briefService = ds.getService('briefe')
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
      const compiled = this.replaceFields(tmpl.contents, brief, fields)
      return compiled
    } else {
      throw new Error("Template " + template + " not found")
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
  replaceFields(template: string, brief: BriefType, fields?: Array<{ field: string, replace: string }>) {
    const fieldmatcher = /\[\w+\.\w+\]/ig
    for (const f of fields) {
      if (!f.replace) {
        f.replace = ""
      }
      template = template.replace("[" + f.field + "]", f.replace)

    }

    const compiled = template.replace(fieldmatcher, field => {
      const stripped = field.substring(1, field.length - 1)
      const [element, attribute] = stripped.split(".")
      let replacement: string
      switch (element.toLowerCase()) {
        case "adressat":
        case "addressee": replacement = brief.destid ? brief.destid[attribute] : null; break;
        case "patient":
        case "concern": replacement = brief.patientid ? brief.patientid[attribute] : null; break
        case "datum": replacement = this.dt.DateObjectToLocalDate(new Date())
        default: {
          const lastSelected = this.we.getSelectedItem(element)
          if (lastSelected) {
            replacement = lastSelected[attribute]
          }
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
}
