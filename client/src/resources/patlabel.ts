import { valueConverter } from 'aurelia-framework'

@valueConverter('patLabel')
export class PatLabel {
  toView(patient) {
    if (patient) {
      return patient.Bezeichnung1 + " " + patient.Bezeichnung2
    } else {
      return ""
    }
  }


}
