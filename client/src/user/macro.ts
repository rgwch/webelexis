/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from './../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { DataSource, DataService } from '../services/datasource';

/**
 * Instead od simple mappings from shortcuts to texts we cjose a more powerful approach:
 * The Macroprocessor is a class with functions to process keyboard inputs.
 * The API is not stable yet.
 */
@autoinject
export class Macroprocessor {
  private patients: DataService
  private findings: DataService
  bdbmi=/(\d{2,3})\/(\d{2,3})/

  constructor(private ds: DataSource, private we: WebelexisEvents) {
    this.patients = ds.getService('patient')
    this.findings = ds.getService('findings')
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
          const finding = this.createFinding("Blutdruck", word)
          return finding.name + ": " + finding.value
        }else{
          const bmi=Math.round(first/((second/100)^2))
          const finding=this.createFinding("Masse",`Grösse: ${second}cm, Gewicht: ${first}Kg; BMI: ${bmi}`)
          return finding.value
        }
      }
      if (word.match(/[0-9]{2,3}\/[0-9]{2,3}/)) {
        const finding = this.createFinding("Blutdruck", word)
        return finding.name + ": " + finding.value

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
    const finding = {
      date: new Date(),
      patient: actPat.id,
      user: actUser.id,
      name: name,
      value: value
    }
    this.findings.create(finding).then(created=>{
      console.log("finding created")
    })
    return finding;
  }
}
