
import {bindable} from "aurelia-framework";
export class LockableInput{
  @bindable value:string
  @bindable label:string
  @bindable locked:boolean

}