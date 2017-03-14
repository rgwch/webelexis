/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/

import {Refiner} from "./fhirsync";
import {FHIR_CodeableConcept, FHIR_Flag, FHIR_Resource} from "../common/models/fhir";
import * as xid from "../common/xid";
import {FhirObject} from "./fhirobject";
import {SQL} from "../services/mysql";
import * as moment from 'moment'
import {NoSQL} from "../services/mongo";




/*
 mysql> show columns from etiketten;
 +------------+--------------+------+-----+---------+-------+
 | Field      | Type         | Null | Key | Default | Extra |
 +------------+--------------+------+-----+---------+-------+
 | ID         | varchar(25)  | NO   | PRI | NULL    |       |
 | Image      | varchar(25)  | YES  |     | NULL    |       |
 | deleted    | char(1)      | YES  |     | 0       |       |
 | importance | varchar(7)   | YES  |     | NULL    |       |
 | Name       | varchar(40)  | YES  | MUL | NULL    |       |
 | foreground | char(6)      | YES  |     | NULL    |       |
 | background | char(6)      | YES  |     | NULL    |       |
 | classes    | varchar(255) | YES  |     | NULL    |       |
 | LASTUPDATE | bigint(20)   | YES  |     | NULL    |       |
 +------------+--------------+------+-----+---------+-------+

 mysql> show columns from etiketten_object_link;
 +------------+-------------+------+-----+---------+-------+
 | Field      | Type        | Null | Key | Default | Extra |
 +------------+-------------+------+-----+---------+-------+
 | obj        | varchar(25) | YES  | MUL | NULL    |       |
 | etikette   | varchar(25) | YES  | MUL | NULL    |       |
 | LASTUPDATE | bigint(20)  | YES  |     | NULL    |       |
 +------------+-------------+------+-----+---------+-------+

 mysql> show columns from etiketten_objclass_link;
 +----------+-------------+------+-----+---------+-------+
 | Field    | Type        | Null | Key | Default | Extra |
 +----------+-------------+------+-----+---------+-------+
 | objclass | varchar(80) | YES  | MUL | NULL    |       |
 | sticker  | varchar(25) | YES  |     | NULL    |       |
 +----------+-------------+------+-----+---------+-------+

 mysql> show columns from dbimage;
 +------------+-------------+------+-----+---------+-------+
 | Field      | Type        | Null | Key | Default | Extra |
 +------------+-------------+------+-----+---------+-------+
 | ID         | varchar(25) | NO   | PRI | NULL    |       |
 | deleted    | char(1)     | YES  |     | 0       |       |
 | Datum      | char(8)     | YES  |     | NULL    |       |
 | Title      | varchar(80) | YES  | MUL | NULL    |       |
 | Bild       | longblob    | YES  |     | NULL    |       |
 | LASTUPDATE | bigint(20)  | YES  |     | NULL    |       |
 | Prefix     | varchar(80) | YES  |     | NULL    |       |
 +------------+-------------+------+-----+---------+-------+


 */

export class Flag extends FhirObject implements Refiner {
  static
  concerned_fields = ["ID", "Image", "deketed", "LASTUPDATE", "importance", "Name", "foreground", "background", "classes"]
  dataType: string = "Flag"

  constructor(sql:SQL, nosql:NoSQL) {
    super(sql, nosql)
  }

  fetchNoSQL(params):Promise<Array<FHIR_Resource>> {
    return this.nosql.queryAsync(this.dataType, this.makeMongoQuery(params))
  }

  makeMongoQuery(param: any) {
    let qbe = Object.assign({}, param)
    return qbe
  }

  compare(a:FHIR_Flag,b:FHIR_Flag):number{
    return a.category.text.localeCompare(b.category.text)
  }
  async fetchSQL(params): Promise<Array<FHIR_Resource>> {
    let sql = "SELECT e.id,e.Name,e.foreground, e.background, ol.obj, e.Image, e.LASTUPDATE from " +
      "etiketten as e," +
      "etiketten_object_link as ol" +
      " where e.deleted='0' and ol.etikette=e.ID"

    let vals = []
    if (params.patient) {
      sql += " AND ol.obj=?"
      vals.push(params.patient)
    }
    let raw = await this.sql.queryAsync(sql, vals)
    let result = raw.map(sticker => {
      return this._makeFlagFhir(sticker, `Patient/${params.patient}`)
    })
    return result
  }

  async pushSQL(fhir: FHIR_Resource) {
    let fh: FHIR_Flag = <FHIR_Flag>fhir
    let sql = FhirObject.makeSQLString("etiketten", Flag.concerned_fields)

    let promiseEti = this.sql.insertAsync(sql, this.makeFields(fh))
    let sqlPat = FhirObject.makeSQLString("etiketten_object_link", ["obj", "etikette", "LASTUPDATE"])
    let promisePat = this.sql.insertAsync(sqlPat, [fh.id, fh.subject.reference.substring(8), this.readTimestamp((fh))])
    Promise.all([promiseEti, promisePat]).then(values => {
      return true
    })
  }

  public makeFields(fh: FHIR_Flag) {
    let [image, fg, bg] = this.prop(fh, "subject.display").split(/::/)
    let fields = [
      fh.id,
      image,
      "0",
      this.readTimestamp(fh),
      "importance",
      this.prop(fh, "code.text"),
      fg,
      bg,
      "classes"
    ]
    return fields;
  }

  private sticker_category: FHIR_CodeableConcept = {
    text: "Sticker",
    coding: [{
      "system": xid.domains.elexis_sticker
    }]
  }

  private _makeFlagFhir(sticker, reference): FHIR_Flag {
    let ret: FHIR_Flag = <FHIR_Flag>{
      resourceType: "Flag",
      id: sticker.id,
      meta:{
        lastUpdated: moment(new Date(sticker.LASTUPDATE)).format()
      },
      category: this.sticker_category,
      subject: {
        reference: reference,
        display: `${sticker.Image}::${sticker.foreground}::${sticker.background}`
      },
      status: "active",
      code: {
        text: sticker.Name,
        coding: [{
          system: xid.domains.elexis_sticker,
          display: sticker.Name
        }]
      }
    }
    return ret;

  }


}
