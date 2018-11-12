/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

 
import { FindingsManager } from '../models/findings-model'
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
      let first = parseInt(isbdmi[1])
      let second = parseInt(isbdmi[2])
      if (first > second) {
        const data = fm.createFindingFromString("cardial", word)
        return `BD: ${data[0]}/${data[1]}`
      } else {
        const bmi = Math.round(first / ((second / 100) ^ 2))
        const data = fm.createFindingFromString("physical", word)
        return `Gewicht: ${data[0]}, Grösse: ${data[1]}, BMI: ${data[2]}`
      }
    }
  }, {
    match: /\d{1,3}%\/\d\.?\d?/,
    func: (inr, word, fm: FindingsManager) => {
      const userdefs = fm.getDefinitions()
      if (inr && userdefs.coagulation) {
        const data = fm.createFindingFromString("coagulation", word)
        if (userdefs.coagulation.verbose) {
          return userdefs.coagulation.verbose(data)
        }
        if (userdefs.coagulation.compact) {
          return userdefs.coagulation.compact(data)
        }
        return data
      }

    }
  }, {
    match: /gw/, func: () => "Gewicht"
  }, {
    match: /bd/, func: () => "Blutdruck"
  }, {
    match: /kons/,
    func: () => {
      return `
      <b>S:</b>&nbsp;<br />
      <b>O:</b>&nbsp;<br />
      <b>B:</b>&nbsp;<br />
      <b>P:</b>&nbsp`
    }
  }
]


