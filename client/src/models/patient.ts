import { StickerManager } from './stickers.model';
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
  static sm: StickerManager = Container.instance.get(StickerManager)

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
    const sticker = Patient.sm.getFirstSticker(obj.stickers)
    let style = "color:black;"
    if (sticker) {
      style = `color:#${sticker.foreground || "black"};background-color:#${sticker.background || "white"};`
    }
    let final = `<span style="${style}">${ret}</span>`
    let images = ""

    if (obj.stickers) {
      for (const name of obj.stickers) {
        const imgdata = Patient.sm.getImage(name)
        if (imgdata) {
          images += `<img src="data:image/png;base64,${imgdata}" alt="${name}" style="height:1em;width:1em;padding-left:2px;"
         data-toggle="tooltip" title="${name}">`
        }
      }
    }
    if (images) {
      final += images
    }

    return final
  }
  static getDefinition(): FlexformConfig {
    let i18 = Patient.i18
    return {
      title: () => "", // ()=>Patient.getTitle(),
      compact: true,
      attributes: [
        {
          attribute: "Bezeichnung1",
          label: i18.tr("contact.lastname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4
        }, {
          attribute: "Bezeichnung2",
          label: i18.tr("contact.firstname"),
          datatype: "string",
          validation: Patient.char80,
          validationMessage: Patient.i18.tr("validation.onlyText"),
          sizehint: 4,
        }, {
          attribute: "geburtsdatum",
          label: i18.tr("contact.birthdate"),
          datatype: {
            toForm: x => Patient.dateModelToView(x),
            toData: x => Patient.viewToDateModel(x)
          },
          validation: Patient.checkdate,
          validationMessage: Patient.i18.tr('validation.invalidDate'),
          sizehint: 2
        }, {
          attribute: "geschlecht",
          label: i18.tr("contact.gender"),
          datatype: "string",
          sizehint: 2
        }, {
          attribute: "Strasse",
          label: i18.tr("address.street"),
          datatype: "string",
          sizehint: 12
        },
        {
          attribute: "plz",
          label: i18.tr("address.zip"),
          datatype: "string",
          sizehint: 3
        }, {
          attribute: "Ort",
          label: i18.tr("address.place"),
          datatype: "string",
          sizehint: 9
        }, {
          attribute: "contactPoints",
          label: i18.tr("contact.contactpoints"),
          datatype: "string",
          sizehint: 12
        }, {
          attribute: "bemerkung",
          label: i18.tr("contact.remark"),
          datatype: "text",
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

class ContactRenderer implements FlexformListRenderer {
  fetchElements = (obj: PatientType) => {
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
    if (obj["NatelNr"]) {
      ret.push({
        system: "phone",
        value: obj["NatelNr"],
        use: "mobile",
        rank: 1
      })
    }
    if (obj["EMail"]) {
      ret.push({
        system: "email",
        value: obj["Email"],
        use: "home",
        rank: 4
      })
    }
    if (obj["fax"]) {
      ret.push({
        system: "fax",
        value: obj["fax"],
        use: "old",
        rank: 100
      })
    }
    return ret
  }

  toString: (line: any) => string;


}
