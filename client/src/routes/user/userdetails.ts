import { WebelexisEvents } from "webelexisevents";
import { autoinject, useView, PLATFORM } from "aurelia-framework";

@autoinject
@useView(PLATFORM.moduleName('./userdetails.pug'))
export class Userdetails{
  user

  constructor(private we:WebelexisEvents){
    this.user=this.we.getSelectedItem('usr')
  }
}
