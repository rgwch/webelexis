
import {Store} from 'aurelia-store'
import {State} from './state'
import { autoinject } from 'aurelia-framework';
import { ElexisType } from './models/elexistype';

@autoinject
export class WebelexisEvents{
  private state
  private setDateAction= (state:State, date:Date)=>{
    const newState=Object.assign({},state)
    newState.date=date
    return newState
  }
  private toggleLeftPanelAction=(state:State)=>{
    const newState=Object.assign({},state)
    newState.leftPanel=!state.leftPanel
    return newState
  }
  private selectItemAction=(state:State, item:ElexisType)=>{
    if(!item.type){
      throw new Error("type information missing at selectItemAction")
    }
    const newState=Object.assign({},state)
    newState[item.type]=item
    return newState
  }
  private logoutAction=(state)=>{
    const newState=Object.assign({},state)
    delete newState.usr
    return newState
  }

  constructor(private store:Store<State>){
    this.store.registerAction("SetDate",this.setDateAction)
    this.store.registerAction("SelectItem",this.selectItemAction)
    this.store.registerAction("Logout",this.logoutAction)
    this.store.registerAction("leftPanel",this.toggleLeftPanelAction)
    this.store.state.subscribe(state=>this.state=state)
  }
  setDate(date){
    this.store.dispatch(this.setDateAction,date)
  }

  selectItem(item:ElexisType){
    this.store.dispatch(this.selectItemAction,item)
  }

  toggleLeftPanel(){
    this.store.dispatch(this.toggleLeftPanelAction)
  }

  getSelectedItem(type:string){
    if(!type){
      throw new Error("type information missing at getSelecedItem")
    }
    return this.state[type]
  }

  logout(){
    this.store.dispatch(this.logoutAction)
  }
}
