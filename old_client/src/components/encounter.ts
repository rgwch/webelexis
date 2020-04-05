/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Display an elexis encounter.
 */
import { EncounterType, EncounterManager } from '../models/encounter-model';
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { DateTime } from '../services/datetime';
import { EventAggregator } from 'aurelia-event-aggregator';
import { Macroprocessor } from 'services/macro';
import { WebelexisEvents } from 'webelexisevents';


@autoinject
export class Encounter {
  @bindable public obj: EncounterType
  protected isEditing: boolean = false

  constructor(private dt: DateTime, private ea: EventAggregator,
              private mp: Macroprocessor, private we: WebelexisEvents, 
              private em: EncounterManager) {
                this.ea.subscribe("ck_save", msg => {
                  this.em.save(this.obj)
                })
  }

  protected makros = text => {
    return this.mp.process(this.obj, text)
  }

  protected toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false
      // this.we.deselect('konsultation')
      this.em.save(this.obj)
    } else {
      this.isEditing = true
      this.obj.type = "konsultation"
      this.we.selectItem(this.obj)
      this.em.getCase(this.obj).then(fall => {
        fall.type = "fall"
        this.we.selectItem(fall)
      })
    }
  }

  protected deleteKons() {
    const text = this.obj.eintrag.html
    if (!text || text.replace(/<.*?>/g, "").length === 0) {
      this.em.remove(this.obj)
    } else {
      alert("Eine Konsultation kann nur gelöscht werden, wenn sie keinen Text mehr enthält.")
    }
  }
  protected getGuarantor() {}

  @computedFrom('obj')
  get datum() {
    return this.dt.ElexisDateToLocalDate(this.obj.datum)
  }
}
