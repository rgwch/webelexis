import { Container } from 'aurelia-dependency-injection';
import { IDataSource } from '../services/dataservice';

export class Login {
  message: string;
  username: string
  password: string
  ds: IDataSource

  constructor() {
    this.message = 'Login';
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
