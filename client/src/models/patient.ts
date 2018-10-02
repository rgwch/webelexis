/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { KontaktType } from './kontakt';
import { FHIR_Patient, FHIR_ContactPoint } from '../models/fhir/fhir'
import { DateTime } from '../services/datetime';
import { Container } from 'aurelia-framework'
import * as moment from 'moment'
import { I18N } from 'aurelia-i18n'
import { FlexformConfig, FlexformListRenderer } from '../components/flexform'


/**
 * An Elexis "Patient"
 */
export interface PatientType extends KontaktType {

}

export class Patient {

  static dt = Container.instance.get(DateTime)
  static i18 = Container.instance.get(I18N)

  static getLabel(obj: any): string {
    let ret = obj.Bezeichnung1 + " " + obj.Bezeichnung2
    if (obj.geschlecht) {
      ret += ` (${obj.geschlecht})`
    }
    if (obj.geburtsdatum) {
      let bd = moment(obj.geburtsdatum, "YYYYMMDD")
      let now = moment()
      let years = now.diff(bd, 'years')
      ret += `, ${Patient.dt.toDate(obj.geburtsdatum)}`
      ret += ` (${years})`
    }
    if (obj.patientnr) {
      ret += " [" + obj.patientnr + "]"
    }
    return ret
  }
  static getDefinition(): FlexformConfig {
    let tr = Patient.i18.tr
    return {
      title: () => "", // ()=>Patient.getTitle(),
      compact: true,
      attributes: [
        {
          attribute: "Bezeichnung1",
          label: tr("contact.lastname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4
        }, {
          attribute: "Bezeichnung2",
          label: tr("contact.firstname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4,
        }, {
          attribute: "geburtsdatum",
          label: tr("contact.birthdate"),
          datatype: {
            toForm: x => Patient.dateModelToView(x),
            toData: x => Patient.viewToDateModel(x)
          },
          validation: Patient.checkdate,
          validationMessage: tr('validation.invalidDate'),
          sizehint: 2
        }, {
          attribute: "geschlecht",
          label: tr("contact.gender"),
          datatype: "string",
          sizehint: 2
        }, {
          attribute: "Strasse",
          label: tr("address.street"),
          datatype: "string",
          sizehint: 12
        },
        {
          attribute: "plz",
          label: tr("address.zip"),
          datatype: "string",
          sizehint: 3
        }, {
          attribute: "Ort",
          label: tr("address.place"),
          datatype: "string",
          sizehint: 9
        }, {
          attribute: "contactPoints",
          label: tr("contact.contactpoints"),
          datatype: new ContactRenderer(),
          sizehint: 12
        }, {
          attribute: "bemerkung",
          label: Patient.i18.tr("contact.remark"),
          datatype: "string",
          sizehint: 12

        }
      ]
    }
  }

  static loadContactOptions(obj: PatientType) {

  }

  static char80(val, obj) {
    if (typeof (val) == 'string') {
      if (/^[^;\.+"\*%=§<>|,]{2,80}$/i.test(val)) {
        return true;
      }
    }
    return false;
  }

  static checkdate(val, obj) {
    const m = moment(val)
    if (m.isValid()) {
      if (m.isBefore(new Date())) {
        return true;
      }
    }
    return false
  }
  static dateModelToView(val) {
    const m = moment(val)
    const format = Patient.i18.tr('adapters.date_format')
    const ret = m.format(format)
    return ret
  }

  static viewToDateModel(val) {
    const m = moment(val, "D.M.YYYY")
    const ret = m.format("YYYYMMDD")
    return ret
  }
}

class ContactRenderer implements FlexformListRenderer{
  fetchElements=  (obj: PatientType) => {
    const ret: Array<FHIR_ContactPoint> = []
    if (obj["Telefon1"]) {
      ret.push({
        system: "phone",
        value: obj["Telefon1"],
        use: "home",
        rank: 2
      })
    }
    if (obj["Telefon2"]) {
      ret.push({
        system: "phone",
        value: obj["Telefon2"],
        use: "work",
        rank: 3
      })
    }
    if(obj["NatelNr"]){
      ret.push({
        system:"phone",
        value: obj["NatelNr"],
        use: "mobile",
        rank: 1
      })
    }
    if(obj["EMail"]){
      ret.push({
        system:"email",
        value: obj["Email"],
        use: "home",
        rank: 4
      })
    }
    if(obj["fax"]){
      ret.push({
        system: "fax",
        value: obj["fax"],
        use: "old",
        rank:100
      })
    }
    return ret
  }

  toString: (line: any) => string;


}
