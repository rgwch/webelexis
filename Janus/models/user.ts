const uuid = require('uuid/v4')

export class User {
  public token: string
  public id: string
  public displayName: string
  public familyNames: Array<string>
  public givenNames: Array<string>
  public gender: "male" | "female" | "other"
  public email: string
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
   * @returns The User if they are logged in. Null if there is no such session or if the session is expired
   */
  public static isLoggedIn(sid: string): User {
    let usr = User.loggedIn[sid]
    if (usr) {
      let now = new Date().getTime()
      let li = usr.lastAccess
      let diff = (now - li) / 60000
      if (diff < 10) {
        usr.lastAccess = now
        return usr
      } else {
        delete User.loggedIn[sid]
      }
    }
    return null;
  }

  /**
   * check if a User is currently logged in
   * @param id the user's id
   * @returns {any}
   */
  public static findLoggedInById(id:string){
    for(let key in User.loggedIn){
      if(User.loggedIn[key].id===id){
          return User.isLoggedIn(key)
      }
    }
    return undefined
  }
  public static hasRole(guid: string, role: string): boolean {
    let user = User.isLoggedIn(guid)
    if (user) {
      return (user.roles.some(r => r === role))
    }
    return false
  }

  public static async findOrCreate(data){
    let mongo = require('../services/mongo').MongoDB.getInstance()

    let result = await mongo.getUserById(data.id)
    if (result) {
      return result
    } else {
      let user = new User(data)
      user.roles = ['visitor']
      mongo.writeUser(user)
      return user
    }
  }

  public logIn(): string {
    var guid = uuid()
    this.lastAccess = new Date().getTime()
    User.loggedIn[guid] = this
    return guid
  }
}
