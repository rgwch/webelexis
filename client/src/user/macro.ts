/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from '../webelexisevents';
import { autoinject } from 'aurelia-framework';
import { FindingsManager } from 'models/findings-model';

/**
 * Instead od simple mappings from shortcuts to texts we chose a more powerful approach:
 * The Macroprocessor is a class with functions to process keyboard inputs.
 * The API is not stable yet.
 */
@autoinject
export class Macroprocessor {
  bdbmi=/(\d{2,3})\/(\d{2,3})/
  inr=/\d{1,3}%\/\d\.?\d?/
  userdefs
  constructor(private we: WebelexisEvents, private findings:FindingsManager) {
    this.userdefs=findings.getDefinitions()
  }
  /**
   * process a keyword.
   * @param context either an encounter or a document
   * @param word the last word the user typed before hitting the macro key.
   * @return the expansion for this macro (can be a finding)
   */
  process(context: "encounter" | "document", word: string) {
    if (context === 'encounter') {
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
      } 
      const inr=this.inr.exec(word)
      if(inr && this.userdefs.coagulation){
        const data=this.createFinding("coagulation",word)
        if(this.userdefs.coagulation.verbose){
          return this.userdefs.coagulation.verbose(data)
        }
        if(this.userdefs.coagulation.compact){
          return this.userdefs.coagulation.compact(data)
        }
        return data
      }
      else {
        switch (word) {
          case "gw": return "Gewicht";
          case "bd": return "Blutdruck";
          case "kons": return `
            <b>S:</b>&nbsp;<br />
            <b>O:</b>&nbsp;<br />
            <b>B:</b>&nbsp;<br />
            <b>P:</b>&nbsp`
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
    const item=this.userdefs[name]
    const processed=item.create(value)
    this.findings.addFinding(name,actPat.id, processed).then(added=>{

    })
    return processed;
  }
}
