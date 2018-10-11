import { ElexisType } from './elexistype';
import { autoinject, computedFrom } from "aurelia-framework";

export interface UserType extends ElexisType{
  email?:string
  label: string
  realname?: string
  elexis_id?: string
  elexisuser_id?: string
  elexiskontakt?:any
  roles?: Array<string>
}

@autoinject
export class User implements UserType{
  obj: UserType

  @computedFrom('obj')
  get label(){
    return this.obj.label
  }

  @computedFrom('obj')
  get email(){
    return this.obj.email
  }
  constructor(data:UserType){
    this.obj=data
  }


}
