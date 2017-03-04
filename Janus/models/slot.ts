/*
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich
 */


import {FhirObject} from "./fhirobject";
import {Refiner} from "./fhirsync";
import {FHIR_Resource,FHIR_Slot} from '../../common/models/fhir'
import moment = require("moment");


export class Slot extends FhirObject implements Refiner {
  dataType: string = "Slot"

  fetchNoSQL(params): Promise<Array<FHIR_Resource>> {
    return this.nosql.queryAsync(this.dataType, this.makeMongoQuery(params))
  }

  constructor(sql, nosql) {
    super(sql, nosql)
  }

  makeMongoQuery(parm: any): any {
    return undefined;
  }

  compare(a: FHIR_Resource, b: FHIR_Resource): number {
    return undefined;
  }


  async fetchSQL(params): Promise<Array<FHIR_Resource>> {
    if (params.schedule) {
      let slots = []
      let schedule = params.split("::")
      let appnts = await this.sql.queryAsync("SELECT * FROM agntermine WHERE Tag=? AND BeiWem=?", [schedule[0], schedule[1]])
      if(appnts && appnts.length) {
        let sorted=appnts.sort((a,b)=>{
          let ma=moment(a.start)
          let mb=moment(b.start)
          if(ma.isBefore(mb)){
            return -1
          }
          if(ma.isAfter(mb)){
            return 1
          }
          return 0
        })

        let before = moment(sorted[0].Tag)
        sorted.forEach(appnt => {
          let begin = moment(appnt.Tag)
          begin.add(parseInt(appnt.Beginn), "minutes")
          let end = moment(begin)
          end.add(parseInt(appnt.Dauer), "minutes")
          slots.push({
            resourceType: "Slot",
            id          : super.createUUID(),
            freeBusyType: "free",
            start       : before,
            end         : begin
          })

          slots.push({
            resourceType: "Slot",
            id          : appnt.id,
            identifier  : super.makeIdentifier(appnt.id),
            freeBusyType: "busy",
            start       : begin,
            end         : end,
            overbooked  : false,
            remark      : appnt.Grund,
            meta:{
              tag: [{
                system: super.xid.elexis_appointment,
                code: appnt.id
              }]
            }
          })
          before = end
        })
        return this.fillSlots(slots)
      }else{
        // no appnts
        let slots=super.cfg.agenda.slots.default
        slots.forEach(slot=>{
          let time=slot.timespan.split("-")
          let act=moment(time[0],"hh:mm")
        })
        return []
      }
    } else {
      return []
    }
  }

  fillSlots(slots:Array<FHIR_Slot>):Array<FHIR_Slot>{
  let ret=[]
    slots.forEach(slot=>{
      if(slot.freeBusyType === 'free'){
        let ms=moment(slot.start)
        let me=moment(slot.end)
        let diff=me.unix()-ms.unix()
        if(diff>60){
          ret.push(slot)
        }else{
          ret.push(slot)
        }
      }
    })
    return ret
  }
  pushSQL(fhir: FHIR_Resource): Promise<void> {
    return undefined;
  }

}