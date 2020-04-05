import { Store } from 'aurelia-store';
import { autoinject } from 'aurelia-framework';

import { IUser } from '../models/user-model';


export interface State {
  loggedInUser?: IUser
  check: string
}

export const appState: State = {
  loggedInUser: undefined,
  check: "init"
}

@autoinject
export class HandleState {
  private state
  constructor(private store: Store<State>) {
    this.store.registerAction("LogIn", this.logInAction)
  }
  logIn(user:IUser){
    this.store.dispatch(this.logInAction,user)
    this.store.state.subscribe(state=>(this.state=state))
  }

  private logInAction = (state: State, user: IUser) => {
    const newState = Object.assign({}, state)
    newState.loggedInUser = user
    return newState
  }

}
