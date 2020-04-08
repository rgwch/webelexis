import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';
import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-model';



@autoinject
export class AppState {
  loggedInUser:IUser = null
  ds: IDataSource

  constructor(){
    this.ds=Container.instance.get("DataSource")

  }

  hasRole(role:string): boolean{
    if(this.loggedInUser){
      if(this.loggedInUser.roles.includes(role)){
        return true
      }
    }
    return false
  }
  login(username?:string, password?:string) : Promise<IUser>{
    return this.ds.login(username,password).then(user=>{
      this.loggedInUser=user
      return user
    }).catch(err=>{
      console.log(err)
      this.loggedInUser=null
      return null
    })
    
  }
  

  logOut(){
    this.ds.logout()
    this.loggedInUser=null
  }
}
