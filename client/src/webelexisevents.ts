
import {Store} from 'aurelia-store'
import {State} from './state'
import { autoinject } from 'aurelia-framework';
import { ElexisType } from './models/elexistype';

@autoinject
export class WebelexisEvents{
  private setDateAction= (state:State, date:Date)=>{
    const newState=Object.assign({},state)
    newState.date=date
    return newState
  }
  private selectItemAction=(state:State, item:ElexisType)=>{
    const newState=Object.assign({},state)
    newState[item.type]=item
    return newState
  }
  private logoutAction=(state)=>{
    const newState=Object.assign({},state)
    delete newState.user
    return newState
  }

  constructor(private store:Store<State>){
    this.store.registerAction("SetDate",this.setDateAction)
    this.store.registerAction("SelectItem",this.selectItemAction)
    this.store.registerAction("Logout",this.logoutAction)
  }
  setDate(date){
    this.store.dispatch(this.setDateAction,date)
  }

  selectItem(item:ElexisType){
    this.store.dispatch(this.selectItemAction,item)
  }

  logout(){
    this.store.dispatch(this.logoutAction)
  }
}
