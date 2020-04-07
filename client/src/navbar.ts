import { autoinject } from 'aurelia-framework';
import { AppState } from './services/app-state';

@autoinject
export class Navbar {
  constructor(private appState: AppState) { }

  logout(){
    this.appState.logOut()
  }
}
