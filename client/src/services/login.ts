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

  public async checkSession(): Promise<User>{
    return this.http.get("auth/checksession")
  }

  public async login(username: string, password: string, showError:boolean=true){
    let result = await this.http.post("auth/local", {email: username, password: password})
    if(result) {
      if (result.status === "error") {
        if (showError) {
          alert(result.message)
        }
        return null
      } else {
        return new User(result);
      }
    }else{
      return null
    }
  }

  public async logout(sid:string){

  }

  public formattedURL(url:string){
    return this.http.formatUrl(url)
  }

  public googleSignIn(){
    return this.http.get("auth/google").then(result =>{
      console.log(JSON.stringify(result))
    })
  }

}
