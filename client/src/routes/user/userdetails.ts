import { WebelexisEvents } from "webelexisevents";
import { autoinject } from "aurelia-framework";

@autoinject
export class Userdetails{
  user

  constructor(private we:WebelexisEvents){
    this.user=this.we.getSelectedItem('usr')
  }
}
