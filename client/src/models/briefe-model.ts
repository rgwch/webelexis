import { WebelexisEvents } from './../webelexisevents';
import { DataService, DataSource } from 'services/datasource';
import { autoinject } from 'aurelia-framework';
import { ElexisType } from './elexistype';

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

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.briefService = ds.getService('briefe')
  }

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

  replaceFields(template: string, brief: BriefType, fields?: Array<{ field: string, replace: string }>) {
    const fieldmatcher = /\[\w+\.\w+\]/ig
    for (const f of fields) {
      template = template.replace(f.field, f.replace)
    }

    const compiled = template.replace(fieldmatcher, field => {
      const stripped = field.substring(1, field.length - 1)
      const [element, attribute] = stripped.split(".")
      let replacement
      switch (element) {
        case "adressat":
        case "addressee": replacement = brief.destid ? brief.destid[attribute] : null; break;
        case "patient":
        case "concern": replacement = brief.patientid ? brief.patientid[attribute] : null; break
        default: {
          const lastSelected = this.we.getSelectedItem(element)
          if (lastSelected) {
            replacement = lastSelected[attribute]
          }
        }
      }
      if (replacement) {
        return replacement
      } else {
        return field
      }
    })
    return compiled
  }
}
