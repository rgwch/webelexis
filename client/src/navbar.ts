import { autoinject } from 'aurelia-framework';
import { WebelexisEvents } from './webelexisevents';
import { connectTo } from 'aurelia-store';
import {pluck} from 'rxjs/operators'
import {State} from './state'

@autoinject
@connectTo<State>(store=>store.state.pipe(pluck("user")))
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
    console.log("state :")
  }
}
