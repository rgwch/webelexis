import {HttpWrapper} from './http-wrapper';
import {User} from '../models/user';
import {inject} from 'aurelia-framework';

@inject(HttpWrapper)
export class LoginService {
  private http: HttpWrapper;

  constructor(http: HttpWrapper) {
    this.http = http;
  }

  public login(username:string,password:string):Promise<User> {
    let promise = this.http.post("dologin",{username:username,password:password}).then(result => {
      return new User(result);
    });
    return promise;
  }
}
