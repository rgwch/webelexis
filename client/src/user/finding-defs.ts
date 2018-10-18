/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Use this file to declare all "finding" or "measurement" types you intend to use
 * Entries must be 'FindingDef' types as defined in models/dinding-def
 */
export default [
  {
    name: "physical",
    title: "Gewicht",
    elements: ["Gewicht:kg", "Grösse:cm", "bmi"],
    create: (val) => {
      const [weight, height] = val.split("/")
      const bmi = Math.round(weight / ((height / 100) ^ 2))
      return [weight, height, bmi]
    },
    verbose: (row): string => {
      return `Grösse: ${row[1]}cm, Gewicht: ${row[0]}Kg, BMI: ${row[2]}`
    },
    compact: (row): string => `${row[1]} cm/${row[0]} Kg: BMI ${row[2]}`

  }, {
    name: "cardial",
    title: "Kreislauf",
    elements: ["Systolisch:mmHg", "Diastolisch:mmHg", "Puls:1/min"],
    create: val => {
      const [syst, diast, pulse = 0] = val.split("/")
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
    elements: ["BZ:mmol/l", "HbA1c:%"],
    create: val => val,
    verbose: (row) => row
  }, {
    name: "coagulation",
    title: "Gerinnung",
    elements: ["Quick:%", "INR"],
    create: val => {
      let [q, inr] = val.split(/[\/,]/)
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
    elements: ["Aufnahme", "Befund:text"],
    create: val => val
  }
]
