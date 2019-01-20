import { WebelexisEvents } from './../webelexisevents';
/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { FindingsManager } from "../models/findings-model";
import * as moment from 'moment'
import { DataSource } from './../services/datasource';
import { Container } from 'aurelia-framework';

/**
 * Use this file to declare all text replacements / macros
 * each entry consists of
 * - match: A RegExp in the user typed text to match
 * - a function which is called with the exec'd regexp, the matched word and the FindingsManager
 *   and returns the replacement.
 */
export default [
  {
    match: /(\d{2,3})\/(\d{2,3})/,
    func: (isbdmi: RegExp, word: string, fm: FindingsManager) => {
      const first = parseInt(isbdmi[1], 10);
      const second = parseInt(isbdmi[2], 10);
      if (first > second) {
        const data = fm
          ? fm.createFindingFromString("cardial", word)
          : [first, second];
        return `BD: ${data[0]}/${data[1]}`;
      } else {
        const bmi = Math.round(first / Math.pow(second / 100, 2));
        const data = fm
          ? fm.createFindingFromString("physical", word)
          : [first, second, bmi];
        return `Gewicht: ${data[0]}, Grösse: ${data[1]}, BMI: ${data[2]}`;
      }
    }
  },
  {
    match: /\d{1,3}%\/\d\.?\d?/,
    func: (inr, word, fm: FindingsManager) => {
      const userdefs = fm.getDefinitions();
      if (inr && userdefs.coagulation) {
        const data = fm
          ? fm.createFindingFromString("coagulation", word)
          : word;
        if (userdefs.coagulation.verbose) {
          return userdefs.coagulation.verbose(data);
        }
        if (userdefs.coagulation.compact) {
          return userdefs.coagulation.compact(data);
        }
        return data;
      }
    }
  },
  {
    match: /gw/,
    func: () => "Gewicht"
  },
  {
    match: /bd/,
    func: () => "Blutdruck"
  },
  {
    match: /kons/,
    func: () => {
      return `
      <b>S:</b>&nbsp;<br />
      <b>O:</b>&nbsp;<br />
      <b>B:</b>&nbsp;<br />
      <b>P:</b>&nbsp`;
    }
  },
  {
    match: /auf([\+\-][0-9]+)(\+[0-9]+)?/,
    func: (days: RegExp, word: string) => {
      const first: string = days[1]
      const second = days[2]
      const date = moment()
      const first_prefix = first.substr(0, 1)
      const first_len = parseInt(first.substr(1))
      let from=moment()
      if (first_prefix == "-") {
        from.subtract(first_len, 'days')
      }else{
        from.add(first_len,'days')
      }
      let until=moment()
      if(second){
        const sec_prefix=second.substr(0,1)
        const sec_len=parseInt(second.substr(1))
        if(sec_prefix=="-"){
          until.subtract(sec_len,'days')
        }else{
          until.add(sec_len,'days')
        }
      }
      
      const ds:DataSource=Container.instance.get(DataSource)
      const aufService=ds.getService('auf')
      const we:WebelexisEvents=Container.instance.get(WebelexisEvents)
      const pat=we.getSelectedItem('patient')
      const fall=we.getSelectedItem('fall')
      const kons=we.getSelectedItem('kons')
      const dbformat="YYYYMMDD"
      const today=moment().format(dbformat)
      const auftemplate={
        patientid: pat.id,
        fallid: (fall ? fall.id : undefined),
        prozent: "100",
        datumvon: from.format(dbformat),
        datumbis: until.format(dbformat),
        Grund: (fall ? fall.grund : undefined ),
        AUFZusatz: "",
        BriefID: undefined,
        DatumAUZ: today
      }
      aufService.create(auftemplate).then(created=>{
        console.log("ok")
      })
      return `[AUF vom ${from.format("DD.MM.YYYY")} bis zum ${until.format("DD.MM.YYYY")}]`
      
    }
  }
];
