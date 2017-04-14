import {DialogController} from 'aurelia-dialog'
import {autoinject} from 'aurelia-framework'

@autoinject
export class Confirm{
  private parms
  private buttons=[]

  constructor(private controller:DialogController){}

  activate(params){
    this.parms=params
    let buttons=params.buttons
    for(let b in buttons){
      this.buttons.push({name:b,label:buttons[b]})
    }
  }
}