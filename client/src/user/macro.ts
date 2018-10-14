/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { DataSource, DataService } from '../services/datasource';
import { FindingType, FindingsManager } from 'models/findings-model';
import userdefs from '../user/findings'

/**
 * Instead od simple mappings from shortcuts to texts we cjose a more powerful approach:
 * The Macroprocessor is a class with functions to process keyboard inputs.
 * The API is not stable yet.
 */
@autoinject
export class Macroprocessor {
  bdbmi=/(\d{2,3})\/(\d{2,3})/

  constructor(private we: WebelexisEvents, private findings:FindingsManager) {
    //this.patients = ds.getService('patient')
    //this.findings = ds.getService('findings')
  }
  /**
   * process a keyword.
   * @param context either an encounter or a document
   * @param word the last word the user typed before hitting the macro key.
   * @return the expandion fot this macro (can be a finding)
   */
  process(context: "encounter" | "document", word: string) {
    if (context === 'encounter') {
      /* Example: interpret xxx/yy as blood pressure and create a finding for it.*/
      const isbdmi=this.bdbmi.exec(word)
      if(isbdmi){
        let first=parseInt(isbdmi[1])
        let second=parseInt(isbdmi[2])
        if(first>second){
          const data = this.createFinding("cardial", word)
          return `BD: ${data[0]}/${data[1]}`
        }else{
          const bmi=Math.round(first/((second/100)^2))
          const data=this.createFinding("physical",word)
          return `Gewicht: ${data[0]}, Grösse: ${data[1]}, BMI: ${data[2]}`
        }
      } else {
        switch (word) {
          case "gw": return "Gewicht";
          case "bd": return "Blutdruck";
          case "kons": return `**S:**\n**O:**\nB:\n**P:**\n`
          default: return "bubblegum";
        }
      }
    } else if (context === 'document') {

    }
    return word
  }

  createFinding(name, value) {
    const actPat = this.we.getSelectedItem('patient')
    const actUser = this.we.getSelectedItem('usr')
    const item=userdefs[name]
    const processed=item.create(value)
    this.findings.addFinding(name,processed).then(added=>{

    })
    return processed;
  }
}
