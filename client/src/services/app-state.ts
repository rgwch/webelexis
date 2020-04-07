import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { IUser } from './../models/user-model';

@autoinject
export class AppState {

  constructor(private router:Router){}

  loggedInUser:IUser =null
  isLoggedIn(){
    return !!this.loggedInUser
  }

  logIn(user:IUser){
    this.loggedInUser=user
  }

  logOut(){
    this.loggedInUser=null
  }
}
