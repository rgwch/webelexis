import { bindable } from 'aurelia-framework';

export interface IAction{
  exec: (obj)=>void
  name: string
  icon: string
}


export class Collapse{
  isExpanded:boolean=false
  @bindable actions:Array<IAction>

  toggle(){
    this.isExpanded=!this.isExpanded
    console.log("toggle")
  }
}
