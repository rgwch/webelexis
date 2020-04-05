import { bindable } from "aurelia-framework";

export interface MenuItem{
  separator:boolean
  text:string
  disabled?:"disabled"
  func?:()=>{}
}
export class Menu{
  @bindable items:Array<MenuItem>
}
