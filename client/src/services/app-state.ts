import { IUser } from './../models/user-model';

export class AppState {
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
