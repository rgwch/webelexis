import { autoinject } from 'aurelia-framework';
import { WebelexisEvents } from './webelexisevents';

@autoinject
export class Navbar{
  loggedIn:boolean

  constructor(private ev:WebelexisEvents){}
  logout(){
    this.ev.logout();
  }

  stateChanged(now,before){
    this.loggedIn= (now != undefined)
  }
  attached(){
  }
}
