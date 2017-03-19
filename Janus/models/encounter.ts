/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/
/*  MYSQL fields Behandlungen:
 +-------------+-------------+------+-----+---------+-------+
 | Field       | Type        | Null | Key | Default | Extra |
 +-------------+-------------+------+-----+---------+-------+
 | id          | varchar(25) | NO   | PRI |         |       |
 | fallid      | varchar(25) | YES  | MUL | NULL    |       |
 | mandantid   | varchar(25) | YES  |     | NULL    |       |
 | rechnungsid | varchar(25) | YES  |     | NULL    |       |
 | datum       | varchar(8)  | YES  |     | NULL    |       |
 | diagnosen   | varchar(25) | YES  |     | NULL    |       |
 | leistungen  | varchar(25) | YES  |     | NULL    |       |
 | eintrag     | blob        | YES  |     | NULL    |       |
 | deleted     | char(1)     | YES  |     | 0       |       |
 | LASTUPDATE  | bigint(20)  | YES  |     | NULL    |       |
 +-------------+-------------+------+-----+---------+-------+
 Faelle:
 +----------------+-------------+------+-----+---------+-------+
 | Field          | Type        | Null | Key | Default | Extra |
 +----------------+-------------+------+-----+---------+-------+
 | id             | varchar(25) | NO   | PRI |         |       |
 | patientid      | varchar(25) | YES  | MUL | NULL    |       |
 | garantid       | varchar(25) | YES  |     | NULL    |       |
 | kostentrid     | varchar(25) | YES  |     | NULL    |       |
 | versnummer     | varchar(25) | YES  |     | NULL    |       |
 | fallnummer     | varchar(25) | YES  |     | NULL    |       |
 | betriebsnummer | varchar(25) | YES  |     | NULL    |       |
 | diagnosen      | varchar(25) | YES  |     | NULL    |       |
 | datumvon       | varchar(8)  | YES  |     | NULL    |       |
 | datumbis       | varchar(8)  | YES  |     | NULL    |       |
 | bezeichnung    | varchar(20) | YES  |     | NULL    |       |
 | grund          | varchar(20) | YES  |     | NULL    |       |
 | gesetz         | varchar(10) | YES  |     | NULL    |       |
 | EXTINFO        | blob        | YES  |     | NULL    |       |
 | Status         | varchar(80) | YES  |     | NULL    |       |
 | deleted        | char(1)     | YES  |     | 0       |       |
 | LASTUPDATE     | bigint(20)  | YES  |     | NULL    |       |
 +----------------+-------------+------+-----+---------+-------+

 */

import {Refiner} from "./fhirsync";
import {ElexisUtils} from './elexis-utils'
import {FHIR_Resource,FHIR_Encounter,FHIR_Narrative} from '../common/models/fhir'
import {Janus} from '../services/janus'
import {SQL} from '../services/mysql'
import * as moment from 'moment'
import {FhirObject} from '../models/fhirobject'
import * as xid from '../common/xid'
import {NoSQL} from "../services/mongo";


export class Encounter extends FhirObject implements Refiner {
  dataType:string = "Encounter"
  private versionedResource
  private elx;

  static concerned_fields = ["id", "fallid", "mandantid", "datum", "eintrag", "deleted", "LASTUPDATE"]

  constructor(sql:SQL, nosql:NoSQL) {
    super(sql, nosql)
    this.elx = new ElexisUtils()
  }

  fetchNoSQL(params):Promise<Array<FHIR_Resource>> {
    return this.nosql.queryAsync(this.dataType, this.makeMongoQuery(params))
  }


// 7ba4632caba62c5b3a366
  makeMongoQuery(parm:any) {
    let qbe = Object.assign({}, parm)
    if (qbe['practitioner']) {
      delete qbe['practitioner']
      qbe["participant.individual"] = parm.practitioner
    }
    return qbe
  }

  compare(a: FHIR_Encounter,b:FHIR_Encounter):number{
    return moment(b.period.start).unix()-moment(a.period.start).unix()
  }

  async fetchSQL(params):Promise<Array<FHIR_Resource>> {

    let sql = "SELECT * from faelle as f,behandlungen as b where b.deleted='0'"
    let vals = []
    if (params.episodeofcare) {
      sql += " AND b.fallid=?"
      vals.push(params.episodeofcare)
    }
    if (params.patient) {
      sql += " AND f.patientid=? AND b.fallid=f.id"
      vals.push(params.patient)
    }
    if (params.practitioner) {
      sql += " AND b.mandantid=?"
      vals.push(params.practitioner)
    }
    let raw = await this.sql.queryAsync(sql + " ORDER BY b.datum desc", vals)
    // console.log(JSON.stringify(raw))
    let faelle = new Set()
    let result = raw.map(elem=> {
      faelle.add(elem['fallid'])
      return this._makeConsFhir(elem)
    })

    return result
  }

  private _makeConsFhir(raw) {

    try {
      let buffer = raw.eintrag;
      let vr = this.elx.getVersionedResource(buffer)
      var entry:FHIR_Narrative = <FHIR_Narrative>{
        status:"additional",
        div:vr.text
      }
      var ret = {
        resourceType: "Encounter",
        id: raw.id,
        meta: {
          lastUpdated: moment(new Date(raw.LASTUPDATE)).format()
        },
        identifier: [
          {
            use: "usual",
            system: xid.domains.elexis_uuid,
            value: raw.id
          }, {
            use: "secondary",
            system: xid.domains.elexis_conslabel,
            value: vr.remark
          }
        ],
        text: entry,
        status: "finished",
        class: "outpatient",
        type: "standard", //todo: try to match type from agenda
        episodeOfCare: raw.fallid,
        patient: raw.patientid,
        period: super.makePeriod(raw.datum, raw.datum),
        participant: [{
          individual: raw.mandantid
        }]
      }
      return ret
    } catch (error) {
      this.logger.log("error", "exception while reading cons", {id: raw.id})
      throw(error)
    }
  }

  async pushSQL(fhir:FHIR_Resource):Promise<void> {
    let ep:FHIR_Encounter = <FHIR_Encounter>fhir
    let raw = await this.sql.queryAsync("SELECT eintrag FROM behandlungen WHERE id=?", ep.id)
    let buffer = raw.eintrag;
    let sql = FhirObject.makeSQLString("behandlungen", Encounter.concerned_fields)
    return super.sql.insertAsync(sql, this.makeFields(ep, buffer))
  }

  public makeFields(enc:FHIR_Encounter, buffer:any) {
    let entry = this.elx.updateVersionedResource(buffer, enc.text.div, super.cfg.get("user").username)
    let fields = [
      enc.id,
      enc.episodeOfCare,
      enc.participant[0].individual,
      moment(enc.period.start).format("YYYYMMDD"),
      entry,
      "0",
      super.readTimestamp(enc)
    ]
    return fields
  }

  async deleteObject(id:string){
    return this._deleteObject("behandlungen",this.dataType,id)
  }
}