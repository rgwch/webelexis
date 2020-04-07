import { AppState } from './services/app-state';
import { autoinject } from 'aurelia-framework';
import { timingSafeEqual } from 'crypto';

@autoinject
export class Navbar {
 
  constructor(private appState:AppState){}

  logout(){
    this.appState.logOut()
  }
}
