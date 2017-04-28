/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

const uuid = require('uuid/v4')
const hash = require('crypto-js/sha256')
const base64=require('crypto-js/enc-base64')

/*
  Internal representation of a User
 */
export class InternalUser {
  // public token: string
  public id: string
  public sid: string
  public googleId:string
  public twitterId:string
  private password:any
  public displayName: string
  public familyNames: Array<string>
  public givenNames: Array<string>
  public gender: "male" | "female" | "other"
  public emails: Array<string>
  public roles: Array<string> = []
  public photos: Array<any>
  public lastAccess: number

  constructor(data) {
    Object.assign(this, data);
  }

  public static loggedIn = {}

  /**
   * Check if a session id belongs to a valid user
   * @param sid the session id
   * @returns The InternalUser if they are logged in. Null if there is no such session or if the session is expired
   */
  public static isLoggedIn(sid: string): InternalUser {
    let usr = InternalUser.loggedIn[sid]
    if (usr) {
      let now = new Date().getTime()
      let li = usr.lastAccess
      let diff = (now - li) / 60000
      if (diff < 10) {
        usr.lastAccess = now
        return usr
      } else {
        delete InternalUser.loggedIn[sid]
      }
    }
    return null;

  }

  /**
   * check if a InternalUser is currently logged in
   * @param id the user's id
   * @returns {any}
   */
  public static findLoggedInById(id:string){
    for(let key in InternalUser.loggedIn){
      if(InternalUser.loggedIn[key].id===id){
          return InternalUser.isLoggedIn(key)
      }
    }
    return undefined
  }

  public static async findById(id:string){
    let mongo = require('../services/mongo').MongoDB.getInstance()
    let result = await mongo.getUserById(id)
    return result
  }
  public static hasRole(guid: string, role: string): boolean {
    let user = InternalUser.isLoggedIn(guid)
    if (user) {
      return (user.roles.some(r => r === role))
    }
    return false
  }

  public static findByMail(mail:string){
    let mongo = require('../services/mongo').MongoDB.getInstance()
    return  mongo.getUserByMail(mail)
  }

  public static async findOrCreate(data){
    let mongo = require('../services/mongo').MongoDB.getInstance()

    let result = await mongo.getUserById(data.id)
    if (result) {
      return result
    } else {
      let user = new InternalUser(data)
      user.roles = ['visitor']
      mongo.writeUser(user)
      return user
    }
  }

  public logIn(): string {
    var sid = uuid()
    this.lastAccess = new Date().getTime()
    InternalUser.loggedIn[sid] = this
    this.sid=sid
    return sid
  }

  public logOut(){
    delete InternalUser.loggedIn[this.sid]
  }

  public update(){
    let mongo = require('../services/mongo').MongoDB.getInstance()
    mongo.writeUser(this)
  }

  public checkPassword(pwd:string){
    if(this.password) {
      return (hash(pwd).toString(base64) === this.password)
    }else{
      this.password=hash(pwd).toString(base64)
      this.update()
      return true
    }
  }

  public setPassword(pwd:string){
    this.password=hash(pwd).toString(base64)
    this.update()
  }
}
