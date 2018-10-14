/**
 * A findings user definition
 */

export default {
  "physical": {
    title: "Masse",  
    elements: ["weight", "height", "bmi"],
    create: (val) => {
      const { weight, height } = val.split("/")
      const bmi = Math.round(weight / ((height / 100) ^ 2))
      return [weight, height, bmi]
    }
    
  },
  "cardial": {
    title: "Kreislauf",
    elements: ["syst", "diast", "pulse"],
    create: val => {
      const { syst, diast, pulse } = val.split("/")
      return [syst, diast, pulse]
    }
  },
  "metabolic": {
    title: "Stoffwechsel",
    elements: ["BZ", "HbA1c"],
    create: val => val
  },

  "coagulation": {
    title: "Gerinnung",
    elements: ["Quick", "INR"],
    create: val => {
      const { q, inr } = val.split(",")
      return [q, inr]
    }
  },
  "radiology": {
    title: "Röntgen",
    elements: ["type", "description"],
    create: val => val
  }
}
