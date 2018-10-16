/**
 * A findings user definition
 */

export default {
  "physical": {
    title: "Gewicht",  
    elements: ["weight:kg", "height:cm", "bmi"],
    create: (val) => {
      const [weight, height] = val.split("/")
      const bmi = Math.round(weight / ((height / 100) ^ 2))
      return [weight, height, bmi]
    },
    verbose: (row):string=>{
      return `Grösse: ${row[1]}cm, Gewicht: ${row[0]}Kg, BMI: ${row[2]}`
    },
    compact: (row):string=>`${row[1]} cm/${row[0]} Kg: BMI ${row[2]}`
    
  },
  "cardial": {
    title: "Kreislauf",
    elements: ["syst:mmHg", "diast:mmHg", "pulse:1/min"],
    create: val => {
      const [syst, diast, pulse=0] = val.split("/")
      return [syst, diast, pulse]
    },
    verbose: (row:Array<string|number>)=>{
      let ret=`Blutdruck: ${row[0]}/${row[1]}`
      if(row.length>2 && row[2]!=0){
        ret+=`,P: ${row[2]}`
      }
      return ret
    },
    compact: (row):string=>`BD: ${row[0]}/${row[1]}`
  },
  "metabolic": {
    title: "Stoffwechsel",
    elements: ["BZ:mmol/l", "HbA1c:%"],
    create: val => val,
    verbose: (row)=>row
  },

  "coagulation": {
    title: "Gerinnung",
    elements: ["Quick", "INR"],
    create: val => {
      const { q, inr } = val.split(/[\/,]/)
      return [q, inr]
    },
    verbose: (row):string=>{
      return `Q: ${row[0]}%/INR: ${row[1]}`
    },
    compact: (r):string=>`${r[0]}%:${r[1]}`
  },
  "radiology": {
    title: "Röntgen",
    elements: ["type", "description"],
    create: val => val
  }
}
