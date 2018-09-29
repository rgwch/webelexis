/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import {ElexisType} from './elexistype'
import { Patient } from './patient';
import { Kontakt } from './kontakt';
import {WebelexisEvents} from '../webelexisevents'
import {Container} from 'aurelia-framework'
import { connectTo } from 'aurelia-store';
import {State} from '../state'

/**
 * A Document. It's a template if it has no concern field and template is "1".
 */
export interface DocType extends ElexisType{
  date: Date
  concern?: Patient
  addressee?: Kontakt
  subject?: string    // title or indication of the document
  contents: string    // html contents
  template?: string   // id of the template or "1" if this is a template by itself.
}

@connectTo()
export class Doc{
  obj:DocType
  private state:State

  constructor(obj:DocType){
    if(obj){
      this.obj=obj
    }else{
      this.obj={
        date:new Date(),
        contents:"",
        type: "documents"
      }
    }
  }


  getEditable(template:string){
    const parser=new DOMParser()
    const doc=parser.parseFromString(template,"text/html")
    const fields=Array.from(doc.getElementsByTagName("data-editable"))
    let text=""
    for(let field of fields){
      const name=field.getAttribute("name")
      text+=name+"<br /><hr />"+field.innerHTML+"<hr/><br/>"
    }
    return this.replaceFields(text)
  }

  replaceFields(template:string){
    const fieldmatcher = /\[\w+\.\w+\]/ig
    const compiled = template.replace(fieldmatcher, field => {
      const stripped = field.substring(1, field.length - 1)
      const [element, attribute] = stripped.split(".")
      let replacement
      switch (element) {
        case "adressat":
        case "addressee": replacement = this.obj.addressee ? this.obj.addressee[attribute] : null; break;
        case "patient":
        case "concern": replacement = this.obj.concern ? this.obj.concern[attribute] : null; break
        default: {
          const lastSelected=this.state[element]
          if(lastSelected){
            replacement=lastSelected[attribute]
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
