import { DialogController } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';
import { FindingsModel } from 'models/findings-model';
import * as moment from 'moment'
moment.locale('de')

@autoinject
export class AddFinding{
  @bindable pickermoment=moment()
  finding:FindingsModel
  elements
  values={}

  constructor(private dc:DialogController){}

  activate(finding:FindingsModel){
    this.finding=finding
    this.elements=finding.getElements().map(e=>e.split(":"))
  }

  display(el){
    if(el[1] == undefined){
      return 'none'
    }
  }
  ok(){
    let r=[]
    for(const el of this.elements){
      r.push(this.values[el[0]])
    }
  
    const dat=this.pickermoment.toDate()
    this.finding.addMeasurement(r,dat)
    this.dc.ok(this.finding)
  }
}
