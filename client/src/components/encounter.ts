/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Display an elexis encounter. Decode Samdas to html accordingly
 */
import { EncounterType } from '../models/encounter-model';
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { DateTime } from '../services/datetime';
import { EventAggregator } from 'aurelia-event-aggregator';
import { DataSource, DataService } from '../services/datasource';
import { Macroprocessor } from 'services/macro';
import { WebelexisEvents } from 'webelexisevents';


@autoinject
export class Encounter {
  @bindable public obj: EncounterType
  protected isEditing: boolean = false
  private konsultationService: DataService

  constructor(private dt: DateTime, private ea: EventAggregator, private ds: DataSource,
              private mp: Macroprocessor, private we: WebelexisEvents) {
    this.konsultationService = this.ds.getService('konsultation')
  }

  protected makros = text => {
    return this.mp.process(this.obj, text)
  }
  protected toggleEdit() {
    if (this.isEditing) {
      this.isEditing = false
      this.we.deselect('konsultation')
      this.konsultationService.update(this.obj.id, this.obj)
    } else {
      this.isEditing = true
      this.obj.type = "konsultation"
      this.we.selectItem(this.obj)
    }
  }

  protected deleteKons() {
    const text = this.obj.eintrag.html
    if (!text || text.replace(/<.*?>/g, "").length == 0) {
      this.konsultationService.remove(this.obj.id)
    } else {
      alert("Eine Konsultation kann nur gelöscht werden, wenn sie keinen Text mehr enthält.")
    }
  }
  protected getGuarantor() {

  }

  @computedFrom('obj')
  get datum() {
    return this.dt.ElexisDateToLocalDate(this.obj.datum)
  }
}
