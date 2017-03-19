/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */

import {FhirObject} from "./fhirobject";
import {Refiner} from "./fhirsync";
import {FHIR_Resource,FHIR_Schedule} from '../common/models/fhir'
import * as nconf from 'nconf'
import * as xid from '../common/xid'
import moment = require("moment");
import {SQL} from "../services/mysql";
import {NoSQL} from "../services/mongo";

/**
 * Since elexis does not share the FHIR concept of schedules/slots, we create both on the fly.
 */
export class Schedule extends FhirObject implements Refiner{
  dataType: string="Schedule"

  constructor(sql:SQL, nosql:NoSQL) {
    super(sql, nosql)
  }

  private createSchedule(dateParam:string, actorParam:string):FHIR_Resource{
    let cfg=nconf.get("client")
    let scheduleType=cfg['agenda'].scheduleType
    if(scheduleType == undefined){
      scheduleType={
        type:{
          system: xid.domains.elexis_scheduletype,
          code: "Praxiskonsultation"
        },
        text: "Konsultation"
      }
    }
    let actor=cfg['general'].actors[0].shortLabel
    if(actorParam){
      actor=actorParam
    }
    let date=moment()
    if(dateParam){
      date = moment(dateParam)
    }
    return <FHIR_Resource>{
      id: date.format("YYYYMMDD")+"::"+actor,
      resourceType: "Schedule",
      type: scheduleType,
      actor: actor,
      planningHorizon: super.makePeriod(date.format(), date.format())
    }
  }


  async fetchNoSQL(params):Promise<Array<FHIR_Resource>> {
    return <Array<FHIR_Resource>>[this.createSchedule(params.date,params.actor)]
  }

  compare(a:FHIR_Schedule, b:FHIR_Schedule):number {
    let ma = moment(a.planningHorizon.start)
    let mb = moment(b.planningHorizon.start)
    return ma.unix() - mb.unix()
  }

  async fetchSQL(params): Promise<Array<FHIR_Resource>> {
    return [this.createSchedule(params.date,params.actor)]
  }


  async pushSQL(fhir: FHIR_Resource): Promise<void> {

  }

  async deleteObject(id:string){
    return true
  }
}