const uuid=require('uuid/v4')
const mongoDB=require('../services/mongo').MongoDB

export class User{
  public token:string
  public uid:string
  public displayName: string
  public familyNames: Array<string>
  public givenNames: Array<string>
  public gender: "male"|"female"|"other"
  public email:string
  public roles:Array<string>=[]
  public photos: Array<any>
  public lastAccess:number

  constructor(data) {
    Object.assign(this, data);
  }

  public static loggedIn={}

  public static isLoggedIn(guid:string):User{
    let usr=User.loggedIn[guid]
    if(usr){
      let now=new Date().getTime()
      let li=usr.lastAccess
      let diff=(now-li)/60000
      if(diff<10){
        usr.lastAccess=now
        return usr
      }else{
        delete User.loggedIn[guid]
      }
    }
    return null;
  }

  public static hasRole(guid:string,role:string):boolean{
    let user=User.isLoggedIn(guid)
    if(user){
      return(user.roles.some(r=>r===role))
    }
    return false
  }

  public static findOrCreate(data) : Promise<User>{
    let mongo=mongoDB.getInstance()
    return mongo.getUser(data.id).then(result=>{
      if(result){
        return result
      }else{
        let user=new User(data)
        user.roles=['visitor']
        return user
      }
    })
  }
  public logIn():string{
    var guid=uuid()
    this.lastAccess=new Date().getTime()
    User.loggedIn[guid]=this
    return guid
  }
}
