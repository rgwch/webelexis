import { ElexisType } from './elexistype';
import { autoinject } from "aurelia-framework";

export interface UserType extends ElexisType{
  email?:string
  realname?: string
  elexis_id?: string
  roles?: Array<string>
}

@autoinject
export class User implements UserType{
  obj: UserType

  get email(){
    return this.obj.email
  }
  constructor(data:UserType){
    this.obj=data
  }


}
