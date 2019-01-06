/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { ElexisType } from "./models/elexistype";
import { State } from "./state";

/**
 * This (together with aurelia-store) is the web variant of the ElexisEventDispatcher
 * to fire a selection event, call selectItem(item)
 * to query for a currently selected item, call getSelectedItem(itemtype)
 * to subscribe for change events, subscribe to the 'aurelia-store'
 */
@autoinject
export class WebelexisEvents {
  private state;

  constructor(private store: Store<State>) {
    this.store.registerAction("SetDate", this.setDateAction);
    this.store.registerAction("SelectItem", this.selectItemAction);
    this.store.registerAction("Logout", this.logoutAction);
    this.store.registerAction("leftPanel", this.toggleLeftPanelAction);
    this.store.registerAction("deselect", this.deselectType);
    this.store.state.subscribe(state => (this.state = state));
  }

  public setDate(date) {
    this.store.dispatch(this.setDateAction, date);
  }

  public selectItem(item: ElexisType) {
    this.store.dispatch(this.selectItemAction, item);
  }

  public deselect(type: string) {
    this.store.dispatch(this.deselectType, type);
  }

  public toggleLeftPanel() {
    this.store.dispatch(this.toggleLeftPanelAction);
  }

  public getSelectedItem(type: string) {
    if (!type) {
      throw new Error("type information missing at getSelecedItem");
    }
    return this.state[type];
  }

  public logout() {
    this.store.dispatch(this.logoutAction);
  }
  private setDateAction = (state: State, date: Date) => {
    const newState = Object.assign({}, state);
    newState.date = date;
    return newState;
  };
  private toggleLeftPanelAction = (state: State) => {
    const newState = Object.assign({}, state);
    newState.leftPanel = !state.leftPanel;
    return newState;
  };

  private selectItemAction = (state: State, item: ElexisType) => {
    if (!item.type) {
      throw new Error("type information missing at selectItemAction");
    }
    const newState = Object.assign({}, state);
    newState[item.type] = item;
    return newState;
  };

  private logoutAction = state => {
    const newState = Object.assign({}, state);
    delete newState.usr;
    return newState;
  };

  private deselectType = (state: State, type: string) => {
    const newState = Object.assign({}, state);
    delete newState[type];
    return newState;
  };
}
