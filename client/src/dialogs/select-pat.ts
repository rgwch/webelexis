import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

@autoinject
export class SelectPatient {
  patient = {}

  constructor(private dc: DialogController) { }


}
