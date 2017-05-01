/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpWrapper} from './http-wrapper';
import {PublicUser as User} from '../models/public-user';
import {inject} from 'aurelia-framework';
import {Session} from './session'

@inject(HttpWrapper, Session)
export class LoginService {
  private http: HttpWrapper;
  public baseURL

  constructor(http: HttpWrapper, private session:Session) {
    this.http = http;
    this.baseURL=this.http.formatUrl("/")
  }

  public async checkSession(): Promise<User>{
    if(this.session.getUser()) {
      let status = await this.http.get("auth/checksession")
      if (status.status === "ok") {
        return this.session.getUser()
      } else {
        return null
      }
    }else{
      return null
    }
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
        return new User(result.user);
      }
    }else{
      return null
    }
  }

  public async logout(sid:string){
    this.http.get("auth/logout/"+sid)
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
