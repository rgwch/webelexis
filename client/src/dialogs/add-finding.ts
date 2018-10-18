import { DialogController } from 'aurelia-dialog'
import { autoinject } from 'aurelia-framework';
import { FindingsModel } from 'models/findings-model';

@autoinject
export class AddFinding{
  finding:FindingsModel
  elements:String[]

  constructor(private dc:DialogController){}

  activate(finding:FindingsModel){
    this.finding=finding
    const elements=finding.getElements().map(e=>e.split(":"))
  }

  ok(){
    this.dc.ok(this.finding)
  }
}
