import { autoinject } from 'aurelia-framework';
import { AppState } from './../services/app-state';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';

@autoinject
export class Login {
  message: string;
  username: string
  password: string
  ds: IDataSource

  constructor(private appState:AppState) {
    this.message = 'Login';
    this.ds=Container.instance.get("DataSource")
  }

  doLogin(){
    this.appState.login(this.username,this.password).then(user=>{
      console.log("Logged In")
    }).catch(err=>{
      console.log(err)
    })
  }
}
