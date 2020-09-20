import { Router } from 'aurelia-router';

/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/
import { EventManager, IEvent } from 'models/event-manager';
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { DateTime } from "services/datetime";
import { AppState, SELECTABLE } from 'services/app-state';
import * as moment from 'moment'
import './schedule.scss'


/*
 We use local styles here to avoid pollution of the global namespace
 */
// import "styles/blind.css";
// import "styles/slider.css";

/**
 * A single Agenda entry. Type can be 'free', 'reserved' or any one of the user defined types.
 */
@autoinject
export class Event {
  @bindable
  public entry: IEvent;
  @bindable
  public index: number;
  protected showmenu = false;
  protected maxLen = 50;
  protected detailVisible: boolean = false;
  protected termintypen = [];
  protected terminstaten = [];
  protected selectedTyp;
  protected selectedState;

  constructor(
    private dt: DateTime,
    private evm: EventManager,
    private ea: EventAggregator,
    private appState: AppState,
    private router:Router
  ) { }

  public bind(context) {
    this.termintypen = this.evm.terminTypes;
    this.terminstaten = this.evm.terminStates;
  }

  public showDetail() {
    this.detailVisible = !this.detailVisible;
  }

  
  protected select(dest) {
    const patient = this.entry.kontakt;
    patient.type = SELECTABLE.patient;
    this.appState.selectItem(SELECTABLE.patient,patient);
    this.router.navigateToRoute(dest)        
  }


  protected get typecss() {
    const style = `background-color:${this.evm.getTypeColor(this.entry)};`;
    return style;
  }

  protected get statecss() {
    const style = `background-color:${this.evm.getStateColor(this.entry)};`;
    return style;
  }
  protected getTimes() {
    const ret: string = this.dt.minutesToTimeString(parseInt(this.entry.beginn))
    const end = this.dt.minutesToTimeString(parseInt(this.entry.beginn) + parseInt(this.entry.dauer))
    return ret + "-" + end;
  }
  protected getLabel() {
    return this.evm.getLabel(this.entry);
  }

  protected rawContents() {
    return JSON.stringify(this.entry)
  }

  protected save() {
    this.evm
      .save(this.entry)
      .then(saved => {
        if (saved.id !== this.entry.id) {
          alert("error while saving");
        }
      })
      .catch(err => {
        alert("exception while saving: " + err);
      });
  }
  /*
  protected changeState() {
    const actState = this.entry.terminstatus;
    let index = _.findIndex(this.tm.terminStates, e => e === actState);
    if (index > this.tm.terminStates.length) {
      index = 0;
    } else {
      index++;
    }
    this.entry.terminstatus = this.tm.terminStates[index];
  }
  */
  protected toggleMenu() {
    this.showmenu = !this.showmenu;
  }

  protected get menu() {
    if (this.entry.termintyp === this.evm.terminTypes[0]) {
      return [];
    } else if (this.entry.termintyp === this.evm.terminTypes[1]) {
      return [];
    } else {
      return this.evm.terminStates;
    }
  }
  /**
   * from UI button: Reduce duration of appointmen
   */
  protected shorten() {
    const raw = parseInt(this.entry.dauer, 10) / 2;
    this.entry.dauer = (5 * Math.floor(raw / 5)).toString();

    this.evm.save(this.entry);
  }
  /**
   * from UI button: Double duration of appointment, at most all time until next appnt.
   */
  protected enlarge() {
    this.evm.getNextEvent(this.entry).then(nxt => {
      if (nxt) {
        const maxDuration =
          parseInt(nxt.beginn) - parseInt(this.entry.beginn);
        this.entry.dauer = (Math.min(parseInt(this.entry.dauer) * 2, maxDuration)).toString()

        this.evm.save(this.entry);
      }
    });
  }
  /**
   * from UI button: delete appointment
   */
  protected delete() {
    this.evm.remove(this.entry);
  }

}

export class metadataValueConverter{
  public toView(elem: IEvent){
    const d=new Date(parseInt(elem.angelegt)*60000)
    return `${elem.erstelltvon}, ${moment(d).format("DD.MM.yy HH:mm")}`
  }
}
