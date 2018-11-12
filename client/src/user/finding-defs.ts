/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Use this file to declare all "finding" or "measurement" types you intend to use
 * Entries must be 'FindingDef' types as defined in models/findings-model
 */
export default [
  {
    name: "physical",
    title: "Gewicht",
    elements: [
      { title: "Gewicht", unit: "Kg", manual: true, chart: "left", color: "blue" },
      { title: "Grösse", unit: "cm", manual: true, chart: "none" },
      { title: "bmi", chart: "right", color: "red" }
    ],
    create: (val: string | Array<string>) => {
      const [weight, height] = Array.isArray(val) ? val : val.split("/")
      const bmi = Math.round(parseFloat(weight) / ((parseFloat(height) / 100) ^ 2))
      return [weight, height, bmi]
    },
    verbose: (row): string => {
      return `Grösse: ${row[1]}cm, Gewicht: ${row[0]}Kg, BMI: ${row[2]}`
    },
    compact: (row): string => `${row[1]} cm/${row[0]} Kg: BMI ${row[2]}`

  }, {
    name: "cardial",
    title: "Kreislauf",
    elements: [
      { title: "systolisch", unit: "mmHg", manual: true, chart: "left" },
      { title: "Diastolisch", unit: "mmHg", manual: true, chart: "left" },
      { title: "Puls", unit: "1/min", manual: true, chart: "right" }
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
    compact: (row): string => `BD: ${row[0]}/${row[1]}`
  }, {
    name: "metabolic",
    title: "Stoffwechsel",
    elements: [
      { title: "BZ", unit: " mmol/l", manual: true, chart: "left" },
      { title: "HbA1c", unit: "%", manual: true, chart: "right" }
    ],
    create: val => val,
    verbose: (row) => row
  }, {
    name: "coagulation",
    title: "Gerinnung",
    elements: [
      { title: "Quick", unit: "%", manual: true, chart: "left" },
      { title: "INR", manual: true, chart: "right" }],
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
    compact: (r): string => `${r[0]}%:${r[1]}`
  }, {
    name: "radiology",
    title: "Röntgen",
    elements: [
      { title: "Aufnahme", unit: "text", manual: true, chart: "none" },
      { title: "Befund", unit: "text", manual: true, chart: "none" }],
    create: val => val,
    verbose: row => `${row[0]}:\n${row[1]}`
  }
]
