import { ElexisType, UUID } from "./elexistype";
import { Patient } from "./patient";
import { Kontakt } from "./kontakt";
import { WebelexisEvents } from "../../test/spec/dummyevents";
import { DataSource } from "services/datasource";
import { autoinject } from "aurelia-framework";

/**
 * A Document. It's a template if it has no concern field and template is "1".
 */
export interface DocType extends ElexisType {
  date: string
  concern?: Patient | UUID
  addressee?: Kontakt | UUID
  subject?: string    // title or indication of the document
  contents?: string    // html contents
  template?: string   // id of the template or "1" if this is a template by itself.
}

@autoinject
export class DocManager{
  docService

  constructor(private we:WebelexisEvents, private ds:DataSource){
    this.docService=this.ds.getService('documents')
  }

  async merge(doc:DocType,fields:Array<{field:string,replace:string}>){
    const templates=await this.docService.find({query:{subject: doc.template}})
    if(templates.data.length<1){
      throw(new Error(`Template ${doc.template} not found`))
    }
    const template=templates.data[0]
    const merged=this.replaceFields(template,doc,fields)
    return merged
  }
  getEditable(template: string, doc:DocType) {
    const parser = new DOMParser()
    const domdoc = parser.parseFromString(template, "text/html")
    const fields = Array.from(domdoc.getElementsByTagName("data-editable"))
    let text = ""
    for (let field of fields) {
      const name = field.getAttribute("name")
      text += name + "<br /><hr />" + field.innerHTML + "<hr/><br/>"
    }
    return this.replaceFields(text,doc)
  }

  replaceFields(template: string, doc:DocType, fields?:object) {
    const fieldmatcher = /\[\w+\.\w+\]/ig
    const compiled = template.replace(fieldmatcher, field => {
      const stripped = field.substring(1, field.length - 1)
      const [element, attribute] = stripped.split(".")
      let replacement
      switch (element) {
        case "adressat":
        case "addressee": replacement = doc.addressee ? doc.addressee[attribute] : null; break;
        case "patient":
        case "concern": replacement = doc.concern ? doc.concern[attribute] : null; break
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
