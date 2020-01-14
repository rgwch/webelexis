/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

import { PatientType } from "./../models/patient";
import { CaseType } from "./../models/case";
import { Patient } from "models/patient";
import { autoinject, observable } from "aurelia-framework";
import * as moment from "moment";
import { EncounterManager } from "models/encounter-model";
import { EventAggregator } from "aurelia-event-aggregator";
import "./encounters-by-date.scss";
import { BillingModel } from "models/billings-model";
import { WebelexisEvents } from "webelexisevents";
const DATEFMT = "YYYY-MM-DD";

@autoinject
export class EncountersByDate {
  protected enc;
  protected dateFrom = moment().format(DATEFMT);
  protected dateUntil = moment().format(DATEFMT);
  protected total: number;
  protected count: number;

  protected encounters: Array<{
    datetime: string;
    fall: CaseType;
    patient: PatientType;
  }> = [];
  constructor(
    private em: EncounterManager,
    private ea: EventAggregator,
    private we: WebelexisEvents
  ) {
    this.ea.subscribe(
      "ebd_from",
      (date: { newDate: string; oldDate: string }) => {
        this.dateFrom = moment(date.newDate).format(DATEFMT);
        this.fetch().then(encs => {
          this.encounters = encs;
        });
      }
    );
    this.ea.subscribe("ebd_until", date => {
      this.dateUntil = moment(date.newDate).format(DATEFMT);
      this.fetch().then(encs => {
        this.encounters = encs;
      });
    });
  }

  protected async patLabel(enc) {
    const pat = await this.em.getPatient(enc);
    return Patient.getLabel(pat);
  }

  protected selectPat(pat: PatientType) {
    pat.type = "patient"
    this.we.selectItem(pat);
  }

  private async fetch() {
    const raw = await this.em.fetchFor(this.dateFrom, this.dateUntil, "");
    const processed = [];
    this.total = 0;
    this.count = 0;
    for (const encraw of raw) {
      const patient = await this.em.getPatient(encraw);
      const fall = await this.em.getCase(encraw);
      const billings: BillingModel[] = await this.em.getBillings(encraw);
      const sum = billings.reduce((prev, curr) => prev + curr.getAmount(), 0);
      this.total += sum;
      this.count += 1;
      const encprocessed = {
        datetime: encraw.datum,
        fall,
        patient,
        sum
      };
      processed.push(encprocessed);
    }
    return processed;
  }
}
