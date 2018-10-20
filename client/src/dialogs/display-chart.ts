import { ChartDefinition } from './../components/graph';
import { FindingType } from './../models/findings-model';
import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';

@autoinject
export class DisplayChart{
  finding: FindingType
  definition: ChartDefinition ={
    data: [
      {
        title: "Test",
        values: [] 
      }
    ]
  }

  constructor(private dc:DialogController){}

  activate(finding:FindingType){
    this.finding=finding
    this.definition.data[0].values=this.finding.measurements.map(m=>{
      let vals
      return [m.date,parseInt(<string>m.values[0])]
    })
  }  
}
