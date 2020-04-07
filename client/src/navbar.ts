import { Router } from 'aurelia-router';
import { autoinject } from 'aurelia-framework';
import { AppState } from './services/app-state';

@autoinject
export class Navbar {
  constructor(private appState: AppState, private router:Router) { }

  logout(){
    this.appState.logOut()
    this.router.navigate("/login")
  }
}
