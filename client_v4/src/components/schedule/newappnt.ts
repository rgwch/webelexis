/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2018-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { autoinject, bindable, observable } from "aurelia-framework";
import { IEvent, EventManager } from "models/event-manager";
import { DateTime } from 'services/datetime'
import { IPatient, PatientManager } from 'models/patient-manager';
import { DialogService } from 'aurelia-dialog'
import { SelectPatient } from 'dialogs/select-pat';
import { TextInput } from 'dialogs/text-input';
import { AppState, SELECTABLE } from 'services/app-state';
import { IKontakt } from 'models/kontakt-manager';
import { I18N } from 'aurelia-i18n';
import './schedule.scss'


@autoinject
export class NewAppointment {
  @bindable public termin: IEvent
  public time: string
  @observable public slider: number

  protected termintypen = []
  protected terminstaten = []
  protected terminTyp
  protected terminStatus
  protected kontakt: IKontakt
  protected patlabel: string

  constructor(private dt: DateTime, private appState: AppState,
    private dlgs: DialogService, private i18: I18N,
    private em: EventManager, private patman: PatientManager) { }

  public sliderChanged(minutes: number) {
    this.time = this.dt.minutesToTimeString(minutes)
  }

  public attached() {
    // this.duration=this.termin.obj.dauer
    this.termintypen = this.em.terminTypes
    this.terminstaten = this.em.terminStates
    this.terminTyp = this.termintypen[2]
    this.terminStatus = this.terminstaten[1]
    this.slider = parseInt(this.termin.beginn)
    this.kontakt = this.appState.getSelectedItem(SELECTABLE.patient)
    this.patlabel = this.kontakt ? this.patman.getLabel(this.kontakt as IPatient) : this.i18.tr('info.selectpat')
  }

  protected selectPatient() {

    this.dlgs.open({ viewModel: SelectPatient, model: this.kontakt, lock: false }).whenClosed(response => {
      if (!response.wasCancelled) {
        this.kontakt = response.output
        this.patlabel = this.patman.getLabel(this.kontakt as IPatient)
      } else {
        console.log(response.output);
      }
    });

  }

  protected enterText() {
    const mdl = {
      caption: this.i18.tr("dialog:freetext"),
    }
    this.dlgs.open({ viewModel: TextInput, model: mdl, lock: false}).whenClosed(response => {
      if (!response.wasCancelled) {
        this.kontakt=undefined
        this.patlabel = response.output
      }
    })
  }

  protected newTermin() {
    const user = this.appState.getSelectedItem(SELECTABLE.user) || { label: "wlx" }
    const ip = this.appState.metadata.ip || window.location.host 
    this.termin.beginn = this.slider.toString()
    this.termin.dauer = "30"
    this.termin.termintyp = this.terminTyp
    this.termin.terminstatus = this.terminStatus
    this.termin.patid = (this.kontakt ? this.kontakt.id : this.patlabel);
    this.termin.erstelltvon = user.label + "@" + ip 
    this.termin.angelegt = (Math.round(new Date().getTime()/60000)).toString()
    console.log(this.termin.angelegt)
    this.em.save(this.termin)
  }
}
