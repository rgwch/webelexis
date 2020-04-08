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

  async login(username?:string, password?:string) : Promise<IUser>{
    const user=await this.ds.login(username,password)
    this.loggedInUser=user
    return user
  }
  

  logOut(){
    this.ds.logout()
    this.loggedInUser=null
  }
}
