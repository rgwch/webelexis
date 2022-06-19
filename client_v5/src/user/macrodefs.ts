/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { findingsManager } from "../models"
import { DateTime } from 'luxon'
import { getService } from "../services/io";
import type { PatientType } from '../models/patient-model';
import { currentPatient, currentCase } from "../services/store";
import util from '../services/util'
let actPat: PatientType
currentPatient.subscribe(p => {
  actPat = p
})
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
    func: (isbdmi: RegExpExecArray, word: string) => {
      const first = parseInt(isbdmi[1], 10);
      const second = parseInt(isbdmi[2], 10);
      if (first > second) {
        const data = findingsManager.createMeasurementFromString(actPat.id, "cardial", word)
        return `BD: ${data[0]}/${data[1]}`;
      } else {
        const bmi = Math.round(first / Math.pow(second / 100, 2));
        const data = findingsManager.createMeasurementFromString(actPat.id, "physical", word)
        return `Gewicht: ${data[0]}Kg, Grösse: ${data[1]}cm, BMI: ${data[2]}`;
      }
    }
  },
  {  /* Quick und INR */
    match: /\d{1,3}%\/\d\.?\d?/,
    func: (inr: RegExpExecArray, word: string) => {
      const userdefs = findingsManager.getDefinitions();
      if (inr && userdefs.coagulation) {
        const data = findingsManager.createMeasurementFromString(actPat.id, "coagulation", word)
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
      const firstPrefix = first.substring(0, 1)
      const firstLen = parseInt(first.substring(1), 10)
      let from = DateTime.now()
      if (firstPrefix === "-") {
        from.minus({ days: firstLen })
      } else {
        from.plus({ days: firstLen })
      }
      let until = DateTime.now()
      if (second) {
        const secPrefix = second.substring(0, 1)
        const secLen = parseInt(second.substring(1), 10)
        if (secPrefix === "-") {
          until.minus({ days: secLen })
        } else {
          until.plus({ days: secLen })
        }
      } else {
        until = DateTime.fromJSDate(from.toJSDate())
        from = DateTime.now()
      }

      const aufService = getService('auf')
      const pat = undefined // actPat
      const fall = undefined // actCase
      const dbformat = "yyyyLLdd"
      const today = DateTime.now().toFormat(dbformat)
      const auftemplate = {
        patientid: pat.id,
        fallid: (fall ? fall.id : undefined),
        prozent: "100",
        datumvon: from.toFormat(dbformat),
        datumbis: until.toFormat(dbformat),
        grund: (fall ? fall.grund : undefined),
        aufzusatz: "",
        briefid: undefined,
        datumauz: today
      }
      aufService.create(auftemplate).then(created => {
        created.type = "auf"
        // console.log("ok")
      })
      return `[AUF vom ${util.LuxonToLocalDate(from)} bis zum ${util.LuxonToLocalDate(until)}]`
    }
  }
];
