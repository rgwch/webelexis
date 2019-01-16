/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2019 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import * as _ from "lodash";
import { Statics, TerminModel, TerminType } from "../models/termine-model";
import { TerminManager } from "../models/termine-model";
import { DateTime } from "../services/datetime";
import { WebelexisEvents } from "../webelexisevents";
import { SWITCH_PANELS, DISPLAY } from './../routes/dispatch/index';


/*
 We use local styles here to avoid pollution of the global namespace
 */
import "styles/blind.css";
import "styles/slider.css";

/**
 * A single Agenda entry. Type can be 'free', 'reserved' or any one of the user defined types.
 */
@autoinject
export class AgendaEntry {
  @bindable
  public entry: TerminModel;
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
    private tm: TerminManager,
    private ea: EventAggregator,
    private we: WebelexisEvents
  ) { }

  public bind(context) {
    this.termintypen = Statics.terminTypes;
    this.terminstaten = Statics.terminStates;
  }

  public showDetail() {
    this.detailVisible = !this.detailVisible;
  }

  protected select(view, list) {
    const patient = this.entry.obj.kontakt;
    patient.type = "patient";
    this.we.selectItem(patient);
    if (list) {
      this.ea.publish(SWITCH_PANELS, { left: list, right: view });
    } else {
      this.ea.publish(SWITCH_PANELS, { right: view });
    }
  }

  protected get typecss() {
    const style = `background-color:${this.entry.getTypColor()};`;
    return style;
  }

  protected get statecss() {
    const style = `background-color:${this.entry.getStateColor()};`;
    return style;
  }
  protected getTimes() {
    const ret: string = this.entry.getStartTime().format("HH:mm");
    const end = this.entry.getEndTime().format("HH:mm");
    return ret + "-" + end;
  }
  protected getLabel() {
    return this.entry.getLabel();
  }

  protected rawContents() {
    return this.entry.rawContents();
  }

  protected save() {
    this.tm
      .save(this.entry)
      .then(saved => {
        if (saved.id !== this.entry.obj.id) {
          alert("error while saving");
        }
      })
      .catch(err => {
        alert("exception while saving: " + err);
      });
  }
  protected changeState() {
    const actState = this.entry.obj.TerminStatus;
    let index = _.findIndex(Statics.terminStates, e => e === actState);
    if (index > Statics.terminStates.length) {
      index = 0;
    } else {
      index++;
    }
    this.entry.obj.TerminStatus = Statics.terminStates[index];
  }
  protected toggleMenu() {
    this.showmenu = !this.showmenu;
  }

  protected get menu() {
    if (this.entry.obj.TerminTyp == Statics.terminTypes[0]) {
      return [];
    } else if (this.entry.obj.TerminTyp == Statics.terminTypes[1]) {
      return [];
    } else {
      return Statics.terminStates;
    }
  }
  /**
   * from UI button: Reduce duration of appointmen
   */
  protected shorten() {
    const raw = parseInt(this.entry.obj.Dauer, 10) / 2;
    this.entry.obj.Dauer = (5 * Math.floor(raw / 5)).toString();

    this.tm.save(this.entry);
  }
  /**
   * from UI button: Enlarge duration of appointment
   */
  protected enlarge() {
    this.tm.getNext(this.entry).then(nxt => {
      if (nxt) {
        const maxDuration =
          nxt.getBeginMinutes() - this.entry.getBeginMinutes();
        this.entry.setDuration(
          Math.min(this.entry.getDuration() * 2, maxDuration)
        );
        this.tm.save(this.entry);
      }
    });
  }
  /**
   * from UI button: delete appointment
   */
  protected delete() {
    this.tm.delete(this.entry);
  }
}
