import {User} from "../models/user";
import {NavigationInstruction} from "aurelia-router";

export class Session {
  private currentUser: User;

  constructor() {
    this.checkPersistedCurrentUser();
/*
    this.ls.isLoggedIn(this.currentUser.id).then(loggedIn => {
      if (!loggedIn) {
        this.logout()
      }
    })
    */
  }

  public getUser() {
    if (!this.currentUser) {
      this.checkPersistedCurrentUser()
    }
    return this.currentUser
  }

  public login(user: User) {
    this.setCurrentUser(user)
  }

  private setCurrentUser(user) {
    this.currentUser = user;
    this.persistCurrentUser();
  }

  private persistCurrentUser() {
    window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }

  private checkPersistedCurrentUser() {
    let json = window.sessionStorage.getItem('currentUser');
    this.currentUser = JSON.parse(json);
  }

  public logout() {
    this.currentUser = null;
    window.sessionStorage.removeItem('currentUser');
  }
}
