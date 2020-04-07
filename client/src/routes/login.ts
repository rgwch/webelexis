import { Router } from 'aurelia-router';
import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';

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
      this.router.navigate("")
    }).catch(err=>{
      console.log(err)
    })
  }
}
