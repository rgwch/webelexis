/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { FindingsManager } from "../models/findings-model";
import * as moment from 'moment'
import { DataSource } from './../services/datasource';
import { Container } from 'aurelia-framework';
import { WebelexisEvents } from './../webelexisevents';
import { BriefManager, BriefType } from "models/briefe-model";

/**
 * Use this file to declare all text replacements / macros
 * each entry consists of
 * - match: A RegExp in the user typed text to match
 * - a function which is called with the exec'd regexp, the matched word and the FindingsManager
 *   and returns the replacement.
 */

 /* tslint:disable object-literal-sort-keys */

export default [
  { /* BD oder BMI */
    match: /(\d{2,3})\/(\d{2,3})/,
    func: (isbdmi: RegExpExecArray, word: string, fm: FindingsManager) => {
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
        return `Gewicht: ${data[0]}Kg, Grösse: ${data[1]}cm, BMI: ${data[2]}`;
      }
    }
  },
  {  /* Quick und INR */
    match: /\d{1,3}%\/\d\.?\d?/,
    func: (inr: RegExpExecArray, word: string, fm: FindingsManager) => {
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
  {  /* AUF */
    match: /auf([\+\-][0-9]+)(\+[0-9]+)?/,
    func: (days: RegExpExecArray, word: string) => {
      const first: string = days[1]
      const second = days[2]
      const firstPrefix = first.substr(0, 1)
      const firstLen = parseInt(first.substr(1), 10)
      let from = moment()
      if (firstPrefix === "-") {
        from.subtract(firstLen, 'days')
      } else {
        from.add(firstLen,'days')
      }
      let until = moment()
      if (second) {
        const secPrefix = second.substr(0, 1)
        const secLen = parseInt(second.substr(1), 10)
        if (secPrefix === "-") {
          until.subtract(secLen, 'days')
        } else {
          until.add(secLen, 'days')
        }
      } else {
        until = from.clone()
        from = moment()
      }

      const ds: DataSource = Container.instance.get(DataSource)
      const aufService = ds.getService('auf')
      const we: WebelexisEvents = Container.instance.get(WebelexisEvents)
      const bm: BriefManager = Container.instance.get(BriefManager)
      const pat = we.getSelectedItem('patient')
      const fall = we.getSelectedItem('fall')
      const dbformat = "YYYYMMDD"
      const today = moment().format(dbformat)
      const auftemplate = {
        patientid: pat.id,
        fallid: (fall ? fall.id : undefined),
        prozent: "100",
        datumvon: from.format(dbformat),
        datumbis: until.format(dbformat),
        grund: (fall ? fall.grund : undefined ),
        aufzusatz: "",
        briefid: undefined,
        datumauz: today
      }
      aufService.create(auftemplate).then(created => {
        created.type = "auf"
        we.selectItem(created)
        // console.log("ok")
      })
      return `[AUF vom ${from.format("DD.MM.YYYY")} bis zum ${until.format("DD.MM.YYYY")}]`
    }
  }
];
