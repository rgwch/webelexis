/***************************************
 * This file is part of Webelexis(tm)
 * Copyright (c) 2017 by G. Weirich.
 * All rights reserved.
 ***************************************/
/*  MYSQL fields:
 +-----------------+--------------+------+-----+---------+-------+
 | Field           | Type         | Null | Key | Default | Extra |
 +-----------------+--------------+------+-----+---------+-------+
 | id              | varchar(80)  | NO   | PRI | NULL    |       |
 | istorganisation | char(1)      | YES  |     | 0       |       |
 | istperson       | char(1)      | YES  |     | 0       |       |
 | istpatient      | char(1)      | YES  |     | 0       |       |
 | istanwender     | char(1)      | YES  |     | 0       |       |
 | istmandant      | char(1)      | YES  |     | 0       |       |
 | istlabor        | char(1)      | YES  |     | 0       |       |
 | land            | char(3)      | YES  |     | NULL    |       |
 | geburtsdatum    | varchar(8)   | YES  |     | NULL    |       |
 | geschlecht      | char(1)      | YES  |     | NULL    |       |
 | Titel           | varchar(255) | YES  |     | NULL    |       |
 | Bezeichnung1    | varchar(255) | YES  | MUL | NULL    |       |
 | Bezeichnung2    | varchar(255) | YES  |     | NULL    |       |
 | Bezeichnung3    | varchar(255) | YES  |     | NULL    |       |
 | Strasse         | varchar(255) | YES  |     | NULL    |       |
 | plz             | varchar(6)   | YES  |     | NULL    |       |
 | Ort             | varchar(255) | YES  |     | NULL    |       |
 | telefon1        | varchar(20)  | YES  |     | NULL    |       |
 | telefon2        | varchar(20)  | YES  |     | NULL    |       |
 | fax             | varchar(20)  | YES  |     | NULL    |       |
 | natelnr         | varchar(15)  | YES  |     | NULL    |       |
 | Email           | varchar(255) | YES  |     | NULL    |       |
 | Website         | varchar(255) | YES  |     | NULL    |       |
 | gruppe          | varchar(10)  | YES  |     | NULL    |       |
 | patientnr       | varchar(50)  | YES  |     | NULL    |       |
 | anschrift       | text         | YES  |     | NULL    |       |
 | bemerkung       | text         | YES  |     | NULL    |       |
 | diagnosen       | blob         | YES  |     | NULL    |       |
 | persanamnese    | blob         | YES  |     | NULL    |       |
 | sysanamnese     | blob         | YES  |     | NULL    |       |
 | famanamnese     | blob         | YES  |     | NULL    |       |
 | risiken         | text         | YES  |     | NULL    |       |
 | allergien       | text         | YES  |     | NULL    |       |
 | extinfo         | blob         | YES  |     | NULL    |       |
 | deleted         | char(1)      | YES  |     | 0       |       |
 | LASTUPDATE      | bigint(20)   | YES  |     | NULL    |       |
 | TitelSuffix     | varchar(255) | YES  |     | NULL    |       |
 +-----------------+--------------+------+-----+---------+-------+
 */

import {Refiner} from "./fhirsync";
import {FHIR_Address, FHIR_ContactPoint, FHIR_Identifier, FHIR_Patient, FHIR_Resource} from "../common/models/fhir";
import {Janus} from "../services/janus";
import {SQL} from "../services/mysql";
import * as moment from "moment";
import {FhirObject} from "../models/fhirobject";
import * as xid from "../common/xid";
import {NoSQL} from "../services/mongo";


export class Patient extends FhirObject implements Refiner {
  dataType: string = "Patient"

  static concerned_fields = ["id", "istpatient", "istperson", "land", "geburtsdatum", "geschlecht", "Titel",
    "Bezeichnung1", "Bezeichnung2", "Bezeichnung3", "Strasse", "plz", "Ort", "telefon1", "telefon2", "fax", "natelnr", "Email",
    "Website", "gruppe", "patientnr", "anschrift", "bemerkung", "deleted", "LASTUPDATE", "TitelSuffix"]

  constructor(mysql:SQL, nosql:NoSQL) {
    super(mysql, nosql)
  }

  fetchNoSQL(params):Promise<Array<FHIR_Resource>> {
    return this.nosql.queryAsync(this.dataType, this.makeMongoQuery(params))
  }


  makeMongoQuery(params: any) {
    var query = {}
    if (params.address) {
      query = super.addMongoTerms(["address.line", "address.city", "address.postalCode", "address.country"], params.address)
    }
    if (params.name) {
      query = super.addMongoTerms(["name.given", "name.family"], params.name)
    }
    if (params.id) {
      query = {id: params.id}
    }

    return query
  }

  compare(a: FHIR_Patient, b: FHIR_Patient):number {
    try {
      return a.name[0].family[0].localeCompare(b.name[0].family[0])
    } catch (err) {
      return 0
    }
  }

  private _telecom(telecoms: Array<FHIR_ContactPoint>, system: string): Array<FHIR_ContactPoint> {
    return telecoms.filter(function (phone: FHIR_ContactPoint) {
      return phone.system === system
    }).sort((a, b) => {
      return a.rank - b.rank
    })

  }


  async pushSQL(fhir: FHIR_Resource) {

    let pat: FHIR_Patient = fhir
    let sql = FhirObject.makeSQLString("kontakt", Patient.concerned_fields)
    let main_address: FHIR_Address = {}
    if (pat.address) {
      main_address = pat.address[0]
    }
    let name = pat.name[0]
    let phones = this._telecom(pat.telecom, "phone")
    let fax = this._telecom(pat.telecom, "fax")
    let mail = this._telecom(pat.telecom, "email")
    let website = this._telecom(pat.telecom, "other")
    let mobile = phones.filter(phone => {
      phone.use === 'mobile'
    }).sort((a, b) => {
      return a.rank - b.rank
    })
    let patientIds: Array<FHIR_Identifier> = pat.identifier
    let patnr = patientIds.filter(fhid => {
      return (fhid.system === 'www.elexis.info/patnr') || (fhid.system === xid.domains.elexis_patientnr)
    })[0].value
    let meta = super.prop(pat, "meta")
    let lastupdate = new Date().getTime()
    if (meta && meta.lastUpdated) {
      lastupdate = moment(meta.lastUpdated).valueOf()
    }
    let gender=pat.gender as string
    if(!gender || gender=="unknown" || gender=="other"){
      gender="?"
    }
    let fields = [
      fhir.id,
      "1",
      "1",
      super.prop(main_address, "country"),
      moment(pat.birthDate).format("YYYYMMDD"),
      gender.substring(0, 1),
      super.join(name.prefix),
      super.join(name.family),
      super.join(name.given),
      "",
      super.join(main_address.line, "\n"),
      super.prop(main_address, "postalCode"),
      super.prop(main_address, "city"),
      super.prop(phones[0], "value"),
      super.prop(phones[1], "value"),
      super.prop(fax[0], "value"),
      super.prop(mobile[0], "value"),
      super.prop(mail[0], "value"),
      super.prop(website[0], "value"),
      super.prop(pat, "careProvider"),
      patnr,
      super.prop(main_address, "text"),
      "",
      '0',
      lastupdate,
      super.prop(name, "suffix")
    ]
    fields.forEach(field => {
      if (!field) {
        field = ""
      }
    })
    return await this.sql.insertAsync(sql, fields)
  }


  async fetchSQL(params: any) {
    let _self = this
    let qs = this._mysqlQuery(params);
    if (!qs) {
      throw new Error("too many results")
    } else {
      let raw = await _self.sql.queryAsync(qs.q, qs.p)
      //console.log(JSON.stringify(raw[0]))
      let result = raw.map(elem => {
        return this._makePatientFhir(elem)
      })
      return result
    }
  }

  private _mysqlQuery(params): { q: any, p: any } {
    let sql = "SELECT * from kontakt where istpatient='1' AND deleted='0'"
    let baselen = sql.length
    let vals = []

    if (params.id) {
      sql += " AND id=?"
      vals.push(params.id)
    }
    if (params.address) {
      sql += " AND " + this._addTerm(["strasse", "ort", "plz", "land"], vals, params.address)

    }
    if (params["address-city"]) {
      sql += " AND " + this._addTerm("ort", vals, params["address-city"])
    }
    if (params["address-country"]) {
      sql += " AND " + this._addTerm("land", vals, params["address-country"])
    }
    if (params["address-postalcode"]) {
      sql += " AND " + this._addTerm("plz", vals, params["address-postalcode"])
    }
    if (params["address-state"]) {
      throw this._unimplemented("address-state")
    }
    if (params["address-street"]) {
      sql += " AND " + this._addTerm("strasse", vals, params["address-street"])
    }
    if (params["address-use"]) {
      throw this._unimplemented("address-use")
    }
    if (params["animal-breed"]) {
      throw this._unimplemented("animal-breed")
    }
    if (params["animal-species"]) {
      throw this._unimplemented("animal-species")
    }
    if (params.birthdate) {
      let bd = moment(params.birthdate).format("YYYMMDD")
      sql += " AND geburtsdatum=?"
      vals.push(bd)
    }
    if (params.name) {
      sql += " AND " + this._addTerm(["Bezeichnung1", "Bezeichnung2", "Bezeichnung3"], vals, params.name)
    }
    return (sql.length == baselen) ? undefined : {q: sql, p: vals}

  }

  private _addTerm(name, vals, value) {
    var v1 = value.replace(/\*/g, '%')
    if (v1.indexOf('%') == -1) {
      v1 += '%'
    }
    if (name instanceof Array) {
      let ret = " ("
      for (let fld in name) {
        ret += name[fld] + " like ? or "
        vals.push(v1)
      }
      ret = ret.substring(0, ret.length - 4) + ")"
      return ret;
    } else {
      vals.push(v1)
      return name + " like ?";
    }

  }

  private  _unimplemented(modifier) {
    return new Error("unimplemented: " + modifier)
  }

  private _makePatientFhir(row) {
    let name = []
    name.push({
      use: "usual",
      text: row.Bezeichnung1 + " " + row.Bezeichnung2,
      family: row.Bezeichnung1.split(" "),
      given: row.Bezeichnung2.split(" "),
      prefix: row.titel,
      suffix: row.TitelSuffix

    })
    let telecom = []
    if (row.telefon1) {
      telecom.push({
        resourceType: "ContactPoint",
        system: "phone",
        value: row.telefon1,
        use: "home",
        rank: 1
      })
    }
    if (row.telefon2) {
      telecom.push({
        system: "phone",
        value: row.telefon2,
        use: "work",
        rank: 3
      })
    }
    if (row.natelnr) {
      telecom.push({
        system: "phone",
        value: row.natelnr,
        use: "mobile",
        rank: 2
      })
    }
    if (row.fax) {
      telecom.push({
        system: "fax",
        value: row.fax,
        use: "work",
        rank: 10
      })
    }
    if (row.Email) {
      telecom.push({
        system: "email",
        value: row.Email,
        use: "home",
        rank: 4
      })
    }
    let address = []
    if (row.anschrift || row.strasse) {
      address.push({
        "resourceType": "Address",
        use: "home",
        type: "both",
        text: row.anschrift,
        line: [row.Strasse],
        city: row.Ort,
        postalCode: row.plz,
        country: row.land
      })
    }
    let identifier = [
      {
        use: "usual",
        system: xid.domains.elexis_uuid,
        value: row.id
      },
      {
        "use": "secondary",
        system: xid.domains.elexis_patientnr,
        value: row.patientnr
      }
    ]
    let gender="unknown"
    if(row.geschlecht=='w' || row.geschlecht=="f"){
      gender="female"
    }else if(row.geschlecht=="m"){
      gender="male"
    }

    return {
      resourceType: "Patient",
      id: row.id,
      identifier: identifier,
      gender: gender,
      active: true,
      name: name,
      telecom: telecom,
      address: address,
      birthDate: moment(row.geburtsdatum, 'YYYYMMDD').format(),
      meta: {
        lastUpdated: moment(new Date(row.LASTUPDATE)).format()
      }
    }

  }
}