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

  public async login(username: string, password: string, showError:boolean=true){
    let result = await this.http.post("dologin", {username: username, password: password})
    if(result.status==="error"){
      if(showError) {
        alert(result.message)
      }
      return null
    }else {
      return new User(result);
    }
  }

  /**
   * Check if a user is logged in with the server
   * @param id User-Id
   * @returns {Promise<any>}
   */
  public async isLoggedIn(id:string){
    return await this.http.get(`auth/isLoggedIn/${id}`)
  }
  public formattedURL(url:string){
    return this.http.formatUrl(url)
  }

  /**
   * Get a user from the session id
   * @param guid
   * @returns {Promise<any>}
   */
  public getUser(sid:string){
    return this.http.get("auth/user/"+sid)
  }

  public googleSignIn(){
    return this.http.get("auth/google").then(result =>{
      console.log(JSON.stringify(result))
    })
  }

}
