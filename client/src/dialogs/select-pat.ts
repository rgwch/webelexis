import { Patient } from './../models/patient';
import { ViewerConfiguration } from './../components/commonviewer';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

@autoinject
export class SelectPatient {
  cv: ViewerConfiguration = {
    title: "Patient Auswahl",
    dataType: 'patient',
    searchFields: [{
      name: "$find",
      label: "Name, Vorname oder Geburtsdatum",
      asPrefix: false,
      value: ""
    }],
    createDef: Patient.getDefinition(),
    getLabel: (obj) => Patient.getLabel(obj),
  }
  patient = {}

  constructor(private dc: DialogController) { }


}
