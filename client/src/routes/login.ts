import { autoinject } from 'aurelia-framework';
import { Router } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';

@autoinject
export class Login {
  
  username: string
  password: string
  ds: IDataSource

  constructor(private router:Router) {
    this.ds=Container.instance.get("DataSource")
  }

  doLogin(){
    this.ds.login(this.username,this.password).then(user=>{
      console.log("Logged In")
    }).catch(err=>{
      console.log(err)
    })
  }
}
