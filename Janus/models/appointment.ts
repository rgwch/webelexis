/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {Refiner} from "./fhirsync";
import {FHIR_Resource, FHIR_Flag, FHIR_CodeableConcept, FHIR_Coding, FHIR_Appointment} from '../common/models/fhir'
import * as moment from 'moment'
import * as xid from '../common/xid'
import {SQL} from '../services/mysql'
import {FhirObject} from "./fhirobject";
import {NoSQL} from "../services/mongo";
import {ElexisUtils} from "./elexis-utils"

/*
 mysql> show columns from agntermine;
 +-----------------+--------------+------+-----+---------+-------+
 | Field           | Type         | Null | Key | Default | Extra |
 +-----------------+--------------+------+-----+---------+-------+
 | ID              | varchar(127) | NO   | PRI | NULL    |       |
 | PatID           | varchar(80)  | YES  | MUL | NULL    |       |
 | Bereich         | varchar(25)  | YES  | MUL | NULL    |       |
 | Tag             | char(8)      | YES  | MUL | NULL    |       |
 | Beginn          | char(4)      | YES  |     | NULL    |       |
 | Dauer           | char(4)      | YES  |     | NULL    |       |
 | Grund           | longtext     | YES  |     | NULL    |       |
 | TerminTyp       | varchar(50)  | YES  |     | NULL    |       |
 | TerminStatus    | varchar(50)  | YES  |     | NULL    |       |
 | ErstelltVon     | varchar(25)  | YES  |     | NULL    |       |
 | angelegt        | varchar(10)  | YES  |     | NULL    |       |
 | lastedit        | varchar(10)  | YES  |     | NULL    |       |
 | PalmID          | int(11)      | YES  |     | 0       |       |
 | flags           | varchar(10)  | YES  |     | NULL    |       |
 | deleted         | char(2)      | YES  |     | 0       |       |
 | Extension       | longtext     | YES  |     | NULL    |       |
 | linkgroup       | varchar(50)  | YES  |     | NULL    |       |
 | lastupdate      | bigint(20)   | YES  |     | NULL    |       |
 | StatusHistory   | longtext     | YES  |     | NULL    |       |
 | priority        | char(1)      | YES  |     | NULL    |       |
 | caseType        | char(1)      | YES  |     | NULL    |       |
 | insuranceType   | char(1)      | YES  |     | NULL    |       |
 | treatmentReason | char(1)      | YES  |     | NULL    |       |
 +-----------------+--------------+------+-----+---------+-------+
 */

export class Appointment extends FhirObject implements Refiner {
  dataType:string = "Appointment"
  static util:ElexisUtils = new ElexisUtils()

  static concerned_fields = ["PatID", "Bereich", "Tag", "Beginn", "Dauer", "Grund", "TerminTyp", "TerminStatus",
    "ErstelltVon", "angelegt", "lastedit", "deleted", "lastupdate", "StatusHistory", "priority"]

  constructor(sql:SQL, nosql:NoSQL) {
    super(sql, nosql)
  }

  fetchNoSQL(parm):Promise<Array<FHIR_Resource>> {
    let qbe = {}
    if (parm.patient) {
      qbe["participant.actor"] = "Patient/" + parm.patient
    }
    if (parm.date) {
      qbe['start'] = moment(parm.date, "YYYY-MM-DD").format()
    }
    if (parm.practitioner) {
      qbe['participant.actor'] = "Practitioner/" + parm.practitioner
    }
    if (parm.status) {
      qbe['status'] = parm.status
    }

    return this.nosql.queryAsync(this.dataType, qbe)
  }


  compare(a:FHIR_Appointment, b:FHIR_Appointment) {
    return moment(b.start).unix() - moment(a.start).unix()
  }

  async fetchSQL(params):Promise<Array<FHIR_Resource>> {
    let sql = "SELECT * from agntermine where deleted=?"
    let vals = ["0"]
    if (params.patient) {
      sql += " AND PatID=?"
      vals.push(params.patient)
    }
    if (params.date) {
      sql += " AND Tag=?"
      vals.push(moment(params.date, "YYYY-MM-DD").format("YYYYMMDD"))
    }
    if (params.practioner) {
      sql += " AND Bereich=?"
      vals.push(params.practitioner)
    }
    if (params.location) {
      sql += " AND Bereich=?"
      vals.push(params.location)
    }
    let raw = await this.sql.queryAsync(sql + " ORDER by Tag DESC", vals)
    let result = raw.map(termin => {
      return Appointment._makeAppntFhir(termin)
    })
    return result
  }

  static _makeAppntFhir(raw) {
    let begin = moment(raw.Tag, "YYYYMMDD")
    begin.add(parseInt(raw.Beginn), "minutes")
    let duration = parseInt(raw.Dauer)
    let PatId
    if (raw.PatID && raw.PatID.length > 8) {
      PatId = raw.PatID
    }
    let fhir = {
      resourceType: "Appointment",
      id: raw.ID,
      meta: {
        lastUpdated: moment(new Date(raw.LASTUPDATE as number)).format()
      },
      identifier: [
        {
          use: "usual",
          system: xid.domains.elexis_appointment,
          value: raw.ID
        }
      ],
      status: raw.TerminStatus,
      type: {
        text: raw.TerminTyp
      },
      reason: {
        text: raw.Grund
      },
      priority: raw.priority,
      description: raw.Grund,
      start: begin.format(),
      minutesDuration: duration,
      end: begin.add(duration, "minutes").format(),
      participant: [
        {
          actor: `Practitioner/${raw.Bereich}`,
          required: "required"
        }
      ]
    }
    if (PatId) {
      fhir.participant.push(
        {
          "actor": `Patient/${PatId}`,
          "required": "required"
        }
      )
    }
    return fhir

  }

  static fhirToSql(fhir:FHIR_Appointment) {
    if (fhir.resourceType != 'Appointment') {
      throw new Error("bad parameter type for Appointmenr:pushSQL")
    }

    let sqlQuery = this.makeSQLString("agntermine", ["ID", "PatID", "Tag", "Beginn", "Dauer", "Grund", "TerminTyp", "TerminStatus",
      "lastedit", "lastupdate", "caseType", "insuranceType", "treatmentReason"])
    let values = []
    values.push(fhir.id)
    let pat = fhir.participant.find(part=> {
      return (part.actor.toString()).startsWith("Patient")
    }).toString()
    if (!pat) {
      throw new Error("No Patient given")
    }
    let patid = pat.substring(pat.indexOf("/"))
    values.push(patid)
    let start = moment(fhir.start)
    let end = moment(fhir.end)
    let duration = (end.unix() - start.unix()) / 60
    values.push(Appointment.util.makeCompactFromDateObject(start.toDate()))
    let begin=start.hours()*60+start.minutes()
    values.push(begin.toString())
    values.push(duration.toString())
    values.push(fhir.description)
    values.push(fhir.type.text)
    values.push(fhir.status)
    values.push(this.util.elexisTimeStamp(new Date()))
    values.push(moment().valueOf())
    values.push("")
    values.push("")
    values.push("")
    return{
      query:sqlQuery,
      values:values
    }
  }

  pushSQL(fhir:FHIR_Resource):Promise<void> {
    let query = Appointment.fhirToSql(fhir as FHIR_Appointment)
    return this.sql.insertAsync(query.query,query.values)
  }


}
