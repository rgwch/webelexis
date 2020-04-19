import { IEncounter } from './../models/encounter-model';
import { ICase } from './../models/case-manager';
import { IPatient } from './../models/patient-model';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';
import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-model';



@autoinject
export class AppState {
  loggedInUser:IUser = null
  currentPatient:IPatient=null
  currentCase:ICase=null
  currentEncounter:IEncounter=null
  ds: IDataSource
  subscriptions=new Array<(IUser)=>{}>()

  constructor(){
    this.ds=Container.instance.get("DataSource")

  }

  isLoggedIn(){
    return !!this.loggedInUser
  }

  subscribe(func:(newUser)=>any){
    this.subscriptions.push(func)
  }
  hasRole(role:string): boolean{
    if(this.loggedInUser){
      if(this.loggedInUser.roles.includes(role)){
        return true
      }
    }
    return false
  }
  login=(username?:string, password?:string) : Promise<IUser>=>{
    return this.ds.login(username,password).then( (user:IUser)=>{
      this.loggedInUser=user
      this.subscriptions.forEach(sub=>sub(user))
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
