import { FindingType } from './../models/findings-model';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

@autoinject
export class DisplayChart{
  finding: FindingType
  definition

  constructor(private dc:DialogController){}

  attached(){
    this.definition.values=this.finding.measurements.map(m=>[m.date,m.values[0]])
  }  
}
