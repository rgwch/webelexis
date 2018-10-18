import { DialogController } from 'aurelia-dialog'
import { autoinject, bindable } from 'aurelia-framework';
import { FindingsModel } from 'models/findings-model';

@autoinject
export class AddFinding{
  @bindable pickerdate=new Date()
  finding:FindingsModel
  elements


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
    console.log(this.pickerdate)
    this.dc.ok(this.finding)
  }
}
