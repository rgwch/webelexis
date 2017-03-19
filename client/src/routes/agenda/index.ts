/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import * as moment from "moment";
import {BundleResult, FhirService} from "../../services/fhirservice";
import {AppointmentFactory} from "../../models/appointment";
import {Schedule, ScheduleFactory} from "../../models/schedule";
import {Slot, SlotFactory} from "../../models/slot";
import {autoinject} from "aurelia-framework";
import {EventAggregator} from "aurelia-event-aggregator";
import {Config} from "../../config";
import {FHIR_Slot} from "../../models/fhir";
import {DialogService} from "aurelia-dialog";

@autoinject
export class AgendaRoute {
  slots: BundleResult
  dateDisplay: string
  dateStandard: string = "2017-02-02"
  selectedActor: string
  private dateSubscriber
  private resourceSubscriber
  private host = this


  constructor(private appointmentFactory: AppointmentFactory, private slotFactory: SlotFactory, private scheduleFactory: ScheduleFactory,
              private fhirService: FhirService, private cfg: Config, private ea: EventAggregator, private dialog: DialogService) {

  }

  attached() {
    this.dateSubscriber = this.ea.subscribe("datepicker", event => {
      this.setDay(new Date(event.newDate), this.selectedActor)
    })
    this.resourceSubscriber = this.ea.subscribe("pickresource", resource => {
      this.selectedActor = resource['shortLabel']
      this.setDay(new Date(this.dateStandard), this.selectedActor)
    })
  }

  detached() {
    this.dateSubscriber.dispose()
    this.resourceSubscriber.dispose()
  }

  setDay(date: Date, actor: string) {
    let day = moment(date)
    this.dateDisplay = day.format("dd, DD.MM.YYYY")
    this.dateStandard = day.format("YYYY-MM-DD")
    this.selectedActor = actor
    this.fhirService.filterBy(this.scheduleFactory, [
      {entity: "date", value: day.format("YYYY-MM-DD")},
      {entity: "actor", value: actor}
    ]).then(schedules => {
      if (schedules.status == "ok" && schedules.count > 0) {
        let schedule: Schedule = schedules.values[0]
        this.fhirService.filterBy(this.slotFactory, [{entity: "schedule", value: schedule.id}]).then(appnts => {
          let slots = []
          let lastEnd = day.format("YYYY-MM-DD") + "T00:00:00"
          appnts.values.forEach(appnt => {
            let start = appnt.fhir['start']
            let prev = moment(lastEnd).unix()
            let act = moment(start).unix()
            if (act - prev > 300) {
              slots.push(this._makeFreeSlot(lastEnd, start))
            }
            slots.push(appnt)
            lastEnd = appnt.fhir['end']
          })
          appnts['values'] = slots
          this.slots = appnts
        })
      }
    })
  }

  reload() {
    this.setDay(new Date(this.dateStandard), this.selectedActor)
  }

  activate(params, routeConfig, instruction) {
    let date = params.date ? params.date : new Date()
    let actor = params.actor ? params.actor : this.cfg.general.actors[0].shortLabel
    this.setDay(date, actor)
  }

  private _makeFreeSlot(begin: string, end: string) {
    return new Slot(<FHIR_Slot>{
      resourceType: "Slot",
      id: this.fhirService.createUUID(),
      freeBusyType: "free",
      start: begin,
      end: end
    })
  }

  shorten(slot: Slot) {
    let end = moment(slot.getField('end'))
    let start = moment(slot.getField('start'))
    let diff = (end.unix() - start.unix()) / 2
    let newEnd = start.add(diff, 'seconds')
    slot.setField('end', newEnd.format())
    slot.setField('contained.end', newEnd.format())
    this.fhirService.update(slot.fhir).then(result => {
      this.setDay(new Date(this.dateStandard), this.selectedActor)
    }).catch(err => {
      alert("error " + err)
    })
  }

  lengthen(slot: Slot) {
    let arr = this.slots.values
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].fhir.id == slot.fhir.id) {
        if (i < arr.length - 1) {
          if (arr[i + 1].getField('freeBusyType') == 'free') {
            arr[i].setField('end', arr[i + 1].getField('end'))
            arr[i].setField("contained.end", arr[i + 1].getField('end'))
            this.fhirService.update(slot.fhir).then(result => {
              // arr.splice(i+1,1)
              this.setDay(new Date(this.dateStandard), this.selectedActor)
            }).catch(err => {
              alert("error " + err)
            })
          }
        }
      }
    }
  }

  deleteSlot(slot: Slot, patLabel: string) {
    let contents = {
      title: "Bitte Löschvorgang bestätigen",
      body: "Wollen Sie wirklich den Termin " + slot.getDateTimeField("contained.start") +
      " von " + patLabel + " löschen?",
      buttons: {
        ok: "Ja",
        cancel: "Nein"
      }
    }
    let reallyDelete = "Wirklich Termin löschen?"
    this.dialog.open({viewModel: "dialogs/confirm", model: contents}).then(response => {
      if (response.output == "ok") {
        this.fhirService.deleteObject(slot.fhir).then(result => this.reload())

      }
    })
  }

  dumpSlot(slot) {
    return JSON.stringify(slot)
  }
}
