import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-model';



@autoinject
export class AppState {
  loggedInUser:IUser = null

  logIn(user:IUser){
    this.loggedInUser=user
  }

  logOut(){
    this.loggedInUser=null
  }
}
