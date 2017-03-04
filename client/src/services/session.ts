import {User} from '../models/user';

export class Session {
  public currentUser: User;
  constructor() {
    this.checkPersistedCurrentUser();
  }
  public setCurrentUser(user) {
    this.currentUser = user;
    this.persistCurrentUser();
  }
  public persistCurrentUser() {
    window.sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
  }
  public checkPersistedCurrentUser() {
    let json = window.sessionStorage.getItem('currentUser');
    this.currentUser = JSON.parse(json);
  }
  public logout() {
    this.currentUser = null;
    window.sessionStorage.removeItem('currentUser');
  }
}
