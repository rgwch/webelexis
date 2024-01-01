/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import type { FindingDef, FindingElement } from '../models/findings-model'
/**
 * Use this file to declare all "finding" or "measurement" types you intend to use
 * Entries must be 'FindingDef' types as defined in models/findings-model
 */

export const definitions: Array<FindingDef> = [
  {
    name: "physical",
    title: "Gewicht",
    elements: [
      { title: "Gewicht", unit: "Kg", manual: true, chart: "left", color: "blue" },
      { title: "Grösse", unit: "cm", manual: true, chart: "none" },
      { title: "BMI", unit: "Kg/m2", chart: "right", color: "red", range: [15, 40] }
    ],
    create: (val: string | string[]) => {
      const [weight, height] = Array.isArray(val) ? val : val.split("/")
      const bmi = Math.round(parseFloat(weight) / Math.pow(parseFloat(height) / 100, 2))
      return [weight, height, bmi]
    },
    verbose: (row: string[]): string => {
      return `Grösse: ${row[1]}cm, Gewicht: ${row[0]}Kg, BMI: ${row[2]}`
    },
    compact: (row: string[]): string => `${row[1]} cm/${row[0]} Kg: BMI ${row[2]}`

  }, {
    name: "cardial",
    title: "Kreislauf",
    elements: [
      { title: "systolisch", unit: "mmHg", manual: true, color: "blue", chart: "left", range: [40, 200] },
      { title: "Diastolisch", unit: "mmHg", manual: true, color: "green", chart: "left" },
      { title: "Puls", unit: "1/min", manual: true, chart: "right", color: "red", range: [40, 180] }
    ],
    create: val => {
      const [syst, diast, pulse = 0] = Array.isArray(val) ? val : val.split("/")
      return [syst, diast, pulse]
    },
    verbose: (row: Array<string | number>) => {
      let ret = `Blutdruck: ${row[0]}/${row[1]}`
      if (row.length > 2 && row[2] != 0) {
        ret += `,P: ${row[2]}`
      }
      return ret
    },
    compact: (row): string => `BD: ${row[0]}/${row[1]}` + (row[2] ? ", P:" + row[2] : "")
  }, {
    name: "metabolic",
    title: "Stoffwechsel",
    elements: [
      { title: "BZ", unit: " mmol/l", manual: true, chart: "left" },
      { title: "HbA1c", unit: "%", manual: true, chart: "right" }
    ],
    create: val => {
      return Array.isArray(val) ? val : val.split(/[\/,]/)
    },
    verbose: (row) => `BZ:${row[0]}, HbA1c:${row[1]}`
  }, {
    name: "coagulation",
    title: "Gerinnung",
    elements: [
      { title: "Quick", unit: "%", manual: true, chart: "left", color: "blue", range: [0, 110] },
      { title: "INR", manual: true, chart: "right", color: "red" }],
    create: val => {
      let [q, inr] = Array.isArray(val) ? val : val.split(/[\/,]/)
      if (q.endsWith("%")) {
        q = q.substring(0, q.length - 1)
      }
      return [q, inr]
    },
    verbose: (row): string => {
      return `Q: ${row[0]}%/INR: ${row[1]}`
    },
  }, {
    name: "radiology",
    title: "Röntgen",
    elements: [
      { title: "Aufnahme", unit: "text", manual: true, chart: "none" },
      { title: "Befund", unit: "text", manual: true, chart: "none" }],
    create: val => Array.isArray(val) ? val : [val],
    verbose: row => `${row[0]}:\n${row[1]}`,
    compact: row => `${row[0]}:\n${row[1]}`
  }
]
