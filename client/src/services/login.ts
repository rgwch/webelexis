/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpWrapper} from './http-wrapper';
import {User} from '../models/user';
import {inject} from 'aurelia-framework';

@inject(HttpWrapper)
export class LoginService {
  private http: HttpWrapper;
  public baseURL

  constructor(http: HttpWrapper) {
    this.http = http;
    this.baseURL=this.http.formatUrl("/")
  }

  public login(username: string, password: string): Promise<User> {
    let promise = this.http.post("dologin", {username: username, password: password}).then(result => {
      return new User(result);
    });
    return promise;
  }

  public formattedURL(url:string){
    return this.http.formatUrl(url)
  }

  public getUser(guid:string){
    return this.http.get("auth/user/"+guid)
  }
  /*
  public googleSignIn(){
    return this.http.get("auth/google").then(result =>{
      console.log(JSON.stringify(result))
    })
  }
  */
}
