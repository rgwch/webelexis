import { Router } from 'aurelia-router';
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

  constructor(private appState:AppState, private router:Router) {
    this.message = 'Login';
    this.ds=Container.instance.get("DataSource")
  }

  doLogin(){
    this.appState.login(this.username,this.password).then(user=>{
      console.log("Logged In")
      this.router.navigateToRoute("agenda")
    }).catch(err=>{
      console.log(err)
    })
  }
}
